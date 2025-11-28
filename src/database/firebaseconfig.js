import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { initializeAuth, inMemoryPersistence, signInAnonymously } from "firebase/auth";

// Variables de entorno con las credenciales del proyecto (definidas en .env)
// Se usan con Vite: import.meta.env.VITE_*
// Configuración de Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Inicializa la app de Firebase una sola vez; si ya existe, la reutiliza
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Autenticación anónima con persistencia en memoria para evitar IndexedDB/localStorage
// Útil en entornos restringidos (navegadores móviles, sandboxes)
const auth = initializeAuth(app, {
  persistence: inMemoryPersistence
});
signInAnonymously(auth).catch(() => {});

// Firestore con long polling para mejor compatibilidad en redes/firewalls exigentes
// 'useFetchStreams: false' mantiene transporte clásico
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false
});

export { app, auth, db };