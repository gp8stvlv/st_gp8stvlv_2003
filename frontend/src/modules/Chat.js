import React, { useState, useEffect, useRef } from 'react';
import '../css/Chat.css';
import ChatMessage from './ChatMessage';
import Header from './Header';
import LoginModal from './LoginModal';
import { connectToServer } from '../api/server';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [userName, setUserName] = useState('');
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const wsRef = useRef(null);

    useEffect(() => {
        if (userName) {
            const ws = connectToServer(userName);
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
    }, [userName]);

    const handleLogin = (name) => {
        setUserName(name);
    };

    const handleLogout = () => {
        setUserName('');
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
                sender: userName,
                senderType: 'user',
                time: new Date().toLocaleTimeString(),
                error: false
            };
            wsRef.current.send(JSON.stringify(message));
            setMessages(prevMessages => [...prevMessages, message]);
            setInputValue('');
        }
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div className="chat-wrapper"> {/* Wrap chat content */}
            <Header bankName="Райффайзен Банк" userName={userName} onLogout={handleLogout} onLogin={() => setIsLoginModalOpen(true)} />
            <div className="chat-container">
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <ChatMessage key={index} message={msg.payload} sender={msg.sender} time={msg.time} senderType={msg.senderType} error={msg.error} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                {userName && (
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
