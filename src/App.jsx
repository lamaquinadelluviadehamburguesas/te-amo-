import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RomanticView from './views/RomanticView';
import HomeView from './views/HomeView';
import TimeTogetherView from './views/TimeTogetherView';
import BirthdayView from './views/BirthdayView';
import GalleryView from './views/GalleryView';
import './App.css';

function App() {
  return (
    <Router>
      <img src="/favicon.png?v=1" alt="Logo" className="app-logo" />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/romantic" element={<RomanticView />} />
        <Route path="/time-together" element={<TimeTogetherView />} />
        <Route path="/birthday" element={<BirthdayView />} />
        <Route path="/gallery" element={<GalleryView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
