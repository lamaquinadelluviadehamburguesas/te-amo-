import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RomanticView from './views/RomanticView';
import HomeView from './views/HomeView';
import TimeTogetherView from './views/TimeTogetherView';
import BirthdayView from './views/BirthdayView';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/romantic" element={<RomanticView />} />
        <Route path="/time-together" element={<TimeTogetherView />} />
        <Route path="/birthday" element={<BirthdayView />} />
      </Routes>
    </Router>
  );
}

export default App;
