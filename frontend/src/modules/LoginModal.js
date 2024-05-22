import React, { useState } from 'react';
import '../css/LoginModal.css';

const LoginModal = ({ onClose, onLogin }) => {
    const [name, setName] = useState('');

    const handleLogin = () => {
        if (name.trim() !== '') {
            onLogin(name);
            onClose();
        } else {
            alert('Пожалуйста, введите имя');
        }
    };

    return (
        <div className="login-modal">
            <div className="login-modal-content">
                <span className="login-modal-close" onClick={onClose}>&times;</span>
                <h2>Вход</h2>
                <input
                    className="login-modal-input"
                    type="text"
                    placeholder="Введите ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button className="login-modal-button" onClick={handleLogin}>Войти</button>
            </div>
        </div>
    );
};

export default LoginModal;
