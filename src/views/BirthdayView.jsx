import React, { useEffect, useState } from 'react';
import './BirthdayView.css';

const BirthdayView = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const createItem = (initial = false) => {
            const id = Math.random();
            const left = Math.random() * 100; // Posición horizontal aleatoria
            const duration = 5 + Math.random() * 10; // Duración aleatoria entre 5 y 15s
            const emojis = ['🎈', '🎁', '🎂', '🎉', '🥳'];
            const type = emojis[Math.floor(Math.random() * emojis.length)];
            const size = 1.5 + Math.random() * 2; // Tamaño aleatorio
            const delay = initial ? -(Math.random() * duration) : 0; // Delay negativo si es inicial

            return { id, left, duration, type, size, delay };
        };

        // Crear elementos iniciales
        const initialItems = Array.from({ length: 50 }).map(() => createItem(true));
        setItems(initialItems);

        // Añadir nuevos elementos periódicamente
        const interval = setInterval(() => {
            setItems(prev => [...prev.slice(-50), createItem()]); // Mantener un máximo de elementos
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="birthday-container">
            <div className="message-card">
                <h1 className="birthday-title">Felices 20 años, mi amor</h1>
                <p className="birthday-text">
                    Gracias por llenar mis días de luz. Verte cumplir sueños es mi mayor regalo,
                    y yo solo pido estar a tu lado en cada uno de los años que vienen.
                    Te amo infinitamente.
                </p>
            </div>
            {items.map(item => (
                <div
                    key={item.id}
                    className="floating-item"
                    style={{
                        left: `${item.left}%`,
                        animationDuration: `${item.duration}s`,
                        animationDelay: `${item.delay}s`,
                        fontSize: `${item.size}rem`
                    }}
                >
                    {item.type}
                </div>
            ))}
        </div>
    );
};

export default BirthdayView;
