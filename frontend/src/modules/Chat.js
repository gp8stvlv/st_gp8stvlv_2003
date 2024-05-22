import React, { useState, useEffect, useRef } from 'react';
import '../css/Chat.css';
import ChatMessage from './ChatMessage';
import Header from './Header';
import LoginModal from './LoginModal';
import { connectToServer } from '../api/server'; // Импорт функции для установки соединения с сервером

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [userName, setUserName] = useState('');
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const wsRef = useRef(null); // Добавляем ref для хранения экземпляра WebSocket

    useEffect(() => {
        if (userName) {
            const ws = connectToServer(userName); // Устанавливаем соединение с сервером с передачей имени пользователя
            wsRef.current = ws; // Сохраняем экземпляр WebSocket в ref

            // Обрабатываем полученные сообщения от сервера
            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                // Помечаем сообщение как полученное от банка
                message.senderType = 'bank';
                setMessages(prevMessages => [...prevMessages, message]);
            };

            return () => {
                // Закрываем WebSocket соединение при размонтировании компонента
                ws.close();
            };
        }
    }, [userName]);

    const handleLogin = (name) => {
        setUserName(name);
    };

    const handleLogout = () => {
        setUserName('');
        if (wsRef.current) {
            wsRef.current.close();
        }
    };

    const handleMessageSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim() !== '') {
            // Отправляем сообщение на сервер через WebSocket соединение
            const message = {
                text: inputValue,
                sender: userName,
                senderType: 'user',
                time: new Date().toLocaleTimeString(), // Добавляем время отправки
                error: false // Добавляем свойство error
            };
            wsRef.current.send(JSON.stringify(message)); // Используем экземпляр WebSocket из ref
            setMessages(prevMessages => [...prevMessages, message]); // Добавляем сообщение в состояние
            setInputValue('');
        }
    };

    useEffect(() => {
        // Прокручиваем до последнего сообщения при его добавлении
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div>
            <Header bankName="Райффайзен Банк" userName={userName} onLogout={handleLogout} onLogin={() => setIsLoginModalOpen(true)} />
            <div className="chat-container">
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <ChatMessage key={index} message={msg.text} sender={msg.sender} time={msg.time} senderType={msg.senderType} error={msg.error} />
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
/*
    payload: Vec<u8>, //  text
    has_error: bool, // error
    send_time: String, // time
    sender: String, // sender
*/