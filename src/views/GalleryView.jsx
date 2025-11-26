import React, { useState, useEffect } from 'react';
import { db } from '../database/firebaseconfig';
import { collection, addDoc, onSnapshot, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import './GalleryView.css';

const GalleryView = () => {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setImages(items);
        });

        return () => unsubscribe();
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 1048576) { // 1MB limit for Base64 in Firestore recommended
            alert("La imagen es muy pesada. Intenta con una más pequeña.");
            return;
        }

        setUploading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                await addDoc(collection(db, 'gallery'), {
                    url: reader.result,
                    favorite: false,
                    createdAt: new Date()
                });
            } catch (error) {
                console.error("Error uploading image: ", error);
                alert("Error al subir la imagen");
            } finally {
                setUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const toggleFavorite = async (image) => {
        const imageRef = doc(db, 'gallery', image.id);
        await updateDoc(imageRef, {
            favorite: !image.favorite
        });
    };

    const favorites = images.filter(img => img.favorite);

    return (
        <div className="gallery-container">
            <h1 className="gallery-title">Nuestra Galería de Amor</h1>

            {favorites.length > 0 && (
                <div className="favorites-section">
                    <h2 className="section-title">Momentos Favoritos ❤️</h2>
                    <div className="favorites-carousel">
                        {favorites.map(img => (
                            <div key={img.id} className="carousel-item" onClick={() => setSelectedImage(img)}>
                                <img src={img.url} alt="Favorite memory" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="upload-section">
                <label className="upload-btn">
                    {uploading ? 'Subiendo...' : 'Agregar Nueva Foto 📸'}
                    <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} style={{ display: 'none' }} />
                </label>
            </div>

            <div className="gallery-grid">
                {images.map(img => (
                    <div key={img.id} className="gallery-card">
                        <img src={img.url} alt="Memory" onClick={() => setSelectedImage(img)} />
                        <button
                            className={`favorite-btn ${img.favorite ? 'active' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(img);
                            }}
                        >
                            {img.favorite ? '❤️' : '🤍'}
                        </button>
                    </div>
                ))}
            </div>

            {selectedImage && (
                <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <img src={selectedImage.url} alt="Full size memory" />
                        <button className="close-btn" onClick={() => setSelectedImage(null)}>×</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryView;
