import React, { useEffect, useState } from 'react';
import './RomanticView.css';

const RomanticView = () => {
    const [roses, setRoses] = useState([]);
    const [clickHearts, setClickHearts] = useState([]);

    useEffect(() => {
        const createRose = (initial = false) => {
            const id = Math.random();
            const left = Math.random() * 100; // Posición horizontal aleatoria
            const duration = 5 + Math.random() * 10; // Duración aleatoria entre 5 y 15s
            const type = Math.random() > 0.5 ? '🌹' : '🌸'; // Rosa roja o flor rosa
            const size = 1.5 + Math.random() * 2; // Tamaño aleatorio
            const delay = initial ? -(Math.random() * duration) : 0; // Delay negativo si es inicial

            return { id, left, duration, type, size, delay };
        };

        // Crear rosas iniciales
        const initialRoses = Array.from({ length: 50 }).map(() => createRose(true));
        setRoses(initialRoses);

        // Añadir nuevas rosas periódicamente
        const interval = setInterval(() => {
            setRoses(prev => [...prev.slice(-50), createRose()]); // Mantener un máximo de elementos
        }, 500);

        return () => clearInterval(interval);
    }, []);

    const handleClick = (e) => {
        const id = Math.random();
        const newHeart = {
            id,
            x: e.clientX,
            y: e.clientY,
        };
        setClickHearts(prev => [...prev, newHeart]);

        // Eliminar el corazón después de la animación
        setTimeout(() => {
            setClickHearts(prev => prev.filter(heart => heart.id !== id));
        }, 1000);
    };

    return (
        <div className="romantic-container" onClick={handleClick}>
            <h1 className="message">Te amo, tu pueedes</h1>
            {roses.map(rose => (
                <div
                    key={rose.id}
                    className="rose"
                    style={{
                        left: `${rose.left}%`,
                        animationDuration: `${rose.duration}s`,
                        animationDelay: `${rose.delay}s`,
                        fontSize: `${rose.size}rem`
                    }}
                >
                    {rose.type}
                </div>
            ))}
            {clickHearts.map(heart => (
                <div
                    key={heart.id}
                    className="click-heart"
                    style={{
                        left: heart.x,
                        top: heart.y,
                    }}
                >
                    ❤️
                </div>
            ))}
        </div>
    );
};

export default RomanticView;
