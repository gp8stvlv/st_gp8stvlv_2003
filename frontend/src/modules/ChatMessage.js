import React from 'react';
import '../css/ChatMessage.css';

const ChatMessage = ({ message, sender, timestamp, senderType, error }) => {
    const messageClass = senderType === 'user' ? 'user' : 'bank incoming';
    const errorClass = error ? 'error' : '';

    const timeView = new Date(timestamp).toLocaleTimeString();

    return (
        <div className={`message ${messageClass} ${errorClass}`}>
            <div className="message-info">
                <span className="message-sender">{sender}</span>
            </div>
            <div className="message-text">{error ? "Произошла ошибка" : message}</div>
            <div className="message-time">{timeView}</div>
        </div>
    );
};

export default ChatMessage;