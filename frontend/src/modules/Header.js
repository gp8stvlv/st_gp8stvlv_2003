import React from 'react';
import '../css/Header.css';
import logoImage from '../assert/bankIcon.png';

const Header = ({ bankName, userName, onLogin, onLogout }) => {
    return (
        <header className="header">
            <div className="bank-info">
                <img src={logoImage} alt="Bank Logo" className="bank-logo" />
                <h1 className="bank-name">{bankName}</h1>
            </div>
            <div className="user-info">
                {userName ? (
                    <>
                        <span className="user-name">{userName}</span>
                        <button className="logout-button" onClick={onLogout}>Выйти</button>
                    </>
                ) : (
                    <button className="login-button" onClick={onLogin}>Войти</button>
                )}
            </div>
        </header>
    );
};

export default Header;
