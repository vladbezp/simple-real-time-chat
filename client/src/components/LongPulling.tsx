import React, {useCallback, useEffect, useState} from 'react';
import axios from "axios";
import './styles.css';

interface Message {
    id: number;
    message: string;
}

const LongPulling = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [value, setValue] = useState<string>('');

    const sendMessage = async () => {
        await axios.post('http://localhost:5000/new-messages', {
            message: value,
            id: Date.now()
        });
        setValue('');
    };

    const subscribe = useCallback(async () => {
        try {
            const {data} = await axios.get<{ message: string; id: number }>('http://localhost:5000/get-messages');
            const newMessages: Message = {
                id: data.id,
                message: data.message
            }
            setMessages((prev) => [newMessages, ...prev]);
            await subscribe();
        } catch (e) {
            setTimeout(() => {
                subscribe();
            }, 500);
        }
    }, []);

    useEffect(() => {
        subscribe();
    }, [subscribe]);

    return (
        <div className="real-time-chat">
            <div>
                <h1>Long Pulling</h1>
                <div className="real-time-chat__form">
                    <input value={value} onChange={e => setValue(e.target.value)} type="text" id="input"/>
                    <button onClick={sendMessage}>Send</button>
                </div>
                <div className="real-time-chat__messages">
                    {messages.map(message =>
                        <div key={message.id}>{message.message}</div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default LongPulling;
