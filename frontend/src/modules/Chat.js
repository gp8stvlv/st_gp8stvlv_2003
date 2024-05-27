import React, { useState, useEffect, useRef } from 'react';
import '../css/Chat.css';
import ChatMessage from './ChatMessage';
import Header from './Header';
import LoginModal from './LoginModal';
import { connectToServer } from '../api/server';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [sender, setsender] = useState('');
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const wsRef = useRef(null);

    useEffect(() => {
        if (sender) {
            const ws = connectToServer(sender);
            wsRef.current = ws;

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                message.senderType = 'bank';
                setMessages(prevMessages => [...prevMessages, message]);
            };

            return () => {
                ws.close();
            };
        }
    }, [sender]);

    const handleLogin = (name) => {
        setsender(name);
    };

    const handleLogout = () => {
        setsender('');
        setMessages([]); // Clear messages on logout
        if (wsRef.current) {
            wsRef.current.close();
        }
    };

    const handleMessageSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim() !== '') {
            const message = {
                payload: inputValue,
                sender: sender,
                senderType: 'user',
                send_time: Date.now().toString(),//new Date().toLocaleTimeString(),
                error: false
            };
            wsRef.current.send(JSON.stringify(message));
            setMessages(prevMessages => [...prevMessages, message]);
            setInputValue('');
        }
    };

    useEffect(() => {
        console.log(messages)
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div className="chat-wrapper"> {/* Wrap chat content */}
            <Header bankName="Райффайзен Банк" sender={sender} onLogout={handleLogout} onLogin={() => setIsLoginModalOpen(true)} />
            <div className="chat-container">
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <ChatMessage key={index} message={msg.payload} sender={msg.sender} timestamp={msg.send_time / 1} senderType={msg.senderType} error={msg.has_error} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                {sender && (
                    <form className="chat-form" onSubmit={handleMessageSubmit}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Введите ваше сообщение..."
                        />
                        <button type="submit">Отправить</button>
                    </form>
                )}
            </div>
            {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />}
        </div>
    );
};

export default Chat;