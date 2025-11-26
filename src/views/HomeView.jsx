import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeView.css';

const HomeView = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/romantic');
    };

    return (
        <div className="home-container">
            <button className="navigate-btn" onClick={handleNavigate}>
                Ir a la sorpresa ❤️
            </button>
            <button className="navigate-btn secondary" onClick={() => navigate('/time-together')}>
                Ver nuestro tiempo ⏳
            </button>
            <button className="navigate-btn birthday" onClick={() => navigate('/birthday')}>
                Ir al cumpleaños 🎂
            </button>
            <button className="navigate-btn gallery" onClick={() => navigate('/gallery')}>
                Nuestra Galería 📸
            </button>
        </div>
    );
};

export default HomeView;
