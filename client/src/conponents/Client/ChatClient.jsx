import React, { useState, useEffect } from 'react';
import { Button, InputText } from 'primereact';
import io from 'socket.io-client';

const ChatClient = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const socket = io('http://localhost:2000');

    useEffect(() => {
        const socket = io('http://localhost:2000');

        // קבלת הודעות ישנות כאשר המטופל מתחבר
        socket.on('previousMessages', (msgs) => {
            setMessages(msgs);
        });

        // קבלת הודעה חדשה מהקלינאית
        socket.on('newMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (newMessage.trim() !== '') {
            const message = {
                sender: 'מטופל',
                content: newMessage,
                timestamp: new Date().toLocaleTimeString(),
            };
            socket.emit('sendMessage', message);
            setNewMessage('');
        }
    };

    return (
        <div>
            <h2>צ'אט עם קלינאית</h2>
            <div style={{ height: '300px', overflowY: 'scroll' }}>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}:</strong> {msg.content} <em>({msg.timestamp})</em>
                    </div>
                ))}
            </div>
            <InputText 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)} 
                placeholder="הקלד הודעה..." 
            />
            <Button label="שלח" onClick={sendMessage} />
        </div>
    );
};

export default ChatClient;
