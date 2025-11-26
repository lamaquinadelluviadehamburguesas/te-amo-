import React, { useState, useEffect } from 'react';
import { db } from '../database/firebaseconfig';
import { collection, addDoc, onSnapshot, updateDoc, doc, query, orderBy, serverTimestamp, getDocs, writeBatch } from 'firebase/firestore';
import './GalleryView.css';

const GalleryView = () => {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const q = query(collection(db, 'gallery_images'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            const withUrls = await Promise.all(items.map(async (item) => {
                const cq = query(collection(db, 'gallery_images', item.id, 'chunks'), orderBy('index'));
                const cs = await getDocs(cq);
                const data = cs.docs.map(c => c.data().data).join('');
                const url = `data:${item.type || 'image/jpeg'};base64,` + data;
                return { ...item, url };
            }));
            setImages(withUrls);
        });

        return () => unsubscribe();
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setProgress(0);
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const originalDataUrl = reader.result;
                const img = new Image();
                img.src = originalDataUrl;
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = () => reject(new Error('No se pudo leer la imagen'));
                });

                const maxSide = 1920;
                const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
                const w = Math.round(img.width * scale);
                const h = Math.round(img.height * scale);
                const canvas = document.createElement('canvas');
                canvas.width = w; canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);

                let mime = 'image/webp';
                let dataUrl;
                try {
                    dataUrl = canvas.toDataURL(mime, 0.7);
                    if (!dataUrl.startsWith('data:image/webp')) throw new Error('webp no soportado');
                } catch {
                    mime = 'image/jpeg';
                    dataUrl = canvas.toDataURL(mime, 0.75);
                }

                // generar miniatura
                const thumbMax = 256;
                const tScale = Math.min(1, thumbMax / Math.max(img.width, img.height));
                const tw = Math.round(img.width * tScale);
                const th = Math.round(img.height * tScale);
                const tCanvas = document.createElement('canvas');
                tCanvas.width = tw; tCanvas.height = th;
                const tctx = tCanvas.getContext('2d');
                tctx.drawImage(img, 0, 0, tw, th);
                let thumbUrl;
                try {
                    thumbUrl = tCanvas.toDataURL(mime, 0.6);
                } catch {
                    thumbUrl = tCanvas.toDataURL('image/jpeg', 0.6);
                }

                const base64 = String(dataUrl).split(',')[1] || '';
                    const chunkSize = 950000;
                    const chunkCount = Math.ceil(base64.length / chunkSize);

                const docRef = await addDoc(collection(db, 'gallery_images'), {
                    name: file.name,
                    size: file.size,
                    type: mime,
                    favorite: false,
                    createdAt: serverTimestamp(),
                    chunks: chunkCount,
                    ready: false,
                    thumbUrl
                });

                const chunksCol = collection(db, 'gallery_images', docRef.id, 'chunks');
                const batchSize = 400;
                for (let i = 0; i < chunkCount; i += batchSize) {
                    const batch = writeBatch(db);
                    for (let j = i; j < Math.min(i + batchSize, chunkCount); j++) {
                        const start = j * chunkSize;
                        const end = start + chunkSize;
                        const piece = base64.slice(start, end);
                        const chunkRef = doc(chunksCol);
                        batch.set(chunkRef, { index: j, data: piece });
                    }
                    await batch.commit();
                        setProgress(Math.round((Math.min(i + batchSize, chunkCount) / chunkCount) * 100));
                        await new Promise(r => setTimeout(r, 20));
                }

                await updateDoc(doc(db, 'gallery_images', docRef.id), { ready: true });
                setProgress(100);
            } catch (error) {
                console.error('Error uploading imagen:', error);
                alert(`Error al subir la imagen: ${error?.message || 'revisa la consola'}`);
            } finally {
                setUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const toggleFavorite = async (image) => {
        const imageRef = doc(db, 'gallery_images', image.id);
        await updateDoc(imageRef, {
            favorite: !image.favorite
        });
    };

    const deleteImage = async (image) => {
        try {
            const imgRef = doc(db, 'gallery_images', image.id);
            const chunksCol = collection(db, 'gallery_images', image.id, 'chunks');
            const chunksSnap = await getDocs(chunksCol);
            const batch = writeBatch(db);
            chunksSnap.forEach(ch => batch.delete(ch.ref));
            batch.delete(imgRef);
            await batch.commit();
            if (selectedImage?.id === image.id) setSelectedImage(null);
        } catch (error) {
            console.error('Error deleting image:', error);
            alert(`Error al eliminar la imagen: ${error?.message || 'revisa la consola'}`);
        }
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
                    {uploading ? `Subiendo... ${progress}%` : 'Agregar Nueva Foto 📸'}
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
                        <button
                            className="delete-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteImage(img);
                            }}
                            title="Eliminar"
                        >
                            🗑️
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
