import React, { useState, useEffect } from 'react';
import './TimeTogetherView.css';

const phrases = [
    "Desde que estoy contigo, el tiempo no se mide en horas o días, sino en momentos inolvidables.",
    "Cada segundo a tu lado es un tesoro que guardo, porque es el único tiempo que realmente vale la pena vivir.",
    "No me importa cuántos años pasen, mientras cada uno de ellos me encuentre a tu lado.",
    "El reloj parece ir más rápido cuando estamos juntos, porque la felicidad no tiene prisa en irse.",
    "Tenerte cerca es mi mayor lujo. Contigo, el tiempo se detiene y al mismo tiempo, quiero que dure para siempre.",
    "Antes de ti, el tiempo era solo un concepto. Contigo, es el espacio donde vive nuestro amor.",
    "Si pudiera, congelaría el tiempo en cada uno de nuestros abrazos, solo para quedarme ahí eternamente.",
    "El mejor tiempo que he invertido en mi vida es el que he compartido contigo.",
    "Contigo, no cuento el tiempo que nos queda, sino la calidad de los recuerdos que estamos creando.",
    "Eres mi eternidad favorita. Cada instante contigo es un pedacito de paraíso."
];

const startDate = new Date('2025-11-12T00:00:00');

const calculateTimeElapsed = () => {
    const now = new Date();
    const difference = now - startDate;

    if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        return { days, hours, minutes, seconds };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
};

const TimeTogetherView = () => {
    const [timeElapsed, setTimeElapsed] = useState(calculateTimeElapsed());
    const [expandedCard, setExpandedCard] = useState(null);

    useEffect(() => {
        const updateTimer = () => {
            setTimeElapsed(calculateTimeElapsed());
        };

        const interval = setInterval(updateTimer, 1000);
        // Initial call not needed as state is initialized

        return () => clearInterval(interval);
    }, []);

    const handleCardClick = (index) => {
        setExpandedCard(expandedCard === index ? null : index);
    };

    return (
        <div className="time-together-container">
            <div className="timer-section">
                <h1 className="timer-title">
                 Tiempo en que estás a mi lado, donde cada hora se siente como un segundo Tiempo en que estás a mi lado, donde cada hora se siente como un segundo ❤️⏳✨
                </h1>
                <div className="timer-display">
                    <div className="time-unit">
                        <span className="number">{timeElapsed.days}</span>
                        <span className="label">Días</span>
                    </div>
                    <div className="time-unit">
                        <span className="number">{timeElapsed.hours}</span>
                        <span className="label">Horas</span>
                    </div>
                    <div className="time-unit">
                        <span className="number">{timeElapsed.minutes}</span>
                        <span className="label">Minutos</span>
                    </div>
                    <div className="time-unit">
                        <span className="number">{timeElapsed.seconds}</span>
                        <span className="label">Segundos</span>
                    </div>
                </div>
            </div>

            <div className="cards-grid">
                {phrases.map((phrase, index) => (
                    <div
                        key={index}
                        className={`phrase-card ${expandedCard === index ? 'expanded' : ''}`}
                        onClick={() => handleCardClick(index)}
                    >
                        <p className="phrase-text">{phrase}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimeTogetherView;
