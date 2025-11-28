import React, { useEffect, useState } from 'react';
import './BirthdayView.css';
import { db } from '../database/firebaseconfig';
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';

const BirthdayView = () => {
    const [items, setItems] = useState([]);
    const [notes, setNotes] = useState([]);
    const [noteText, setNoteText] = useState('');
    const [showForm, setShowForm] = useState(false);

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

    useEffect(() => {
        const q = query(collection(db, 'notas'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setNotes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsub();
    }, []);

    const saveNote = async () => {
        const t = noteText.trim();
        if (!t) return;
        await addDoc(collection(db, 'notas'), { text: t, createdAt: serverTimestamp() });
        setNoteText('');
        setShowForm(false);
    };

    return (
        <div className="birthday-container">
            {/* Tarjeta principal del mensaje de cumpleaños (borde dorado y glow) */}
            <div className="message-card">
                <h1 className="birthday-title" style={{ color: 'gold' }}>Felices 20 años, mi amor</h1>
                <p className="birthday-text" style={{ color: 'White' }}>
                    Gracias por llenar mis días de luz. Verte cumplir sueños es mi mayor regalo,
                    y yo solo pido estar a tu lado en cada uno de los años que vienen.
                    Te amo infinitamente.
                </p>
            </div>
            {/* Sección de notas: botón para crear y listado en tarjetas */}
            <div className="notes-section">
                <div className="notes-header">
                    <button className="note-create-btn" onClick={() => setShowForm(v => !v)}>
                        Crear una nota 📝
                    </button>
                </div>
                {showForm && (
                    <div className="note-form">
                        <input
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Escribe tu nota..."
                        />
                        <button className="note-save-btn" onClick={saveNote} disabled={!noteText.trim()}>
                            Guardar
                        </button>
                    </div>
                )}
                <div className="notes-grid">
                    {notes.map(n => (
                        <div key={n.id} className="note-card">
                            <p>{n.text}</p>
                        </div>
                    ))}
                </div>
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
