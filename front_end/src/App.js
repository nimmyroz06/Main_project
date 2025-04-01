import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserSignUp from './components/UserSignUp';
import UserLogin from './components/UserLogin';
import HomePage from './components/HomePage';
import PlasticWasteCalculator from './components/PlasticWasteCalculator';
import Quiz from './components/Quiz';
import WasteUpload from './components/WasteUpload';
import AdminLogin from './components/AdminLogin';
import AdminView from './components/AdminView';
import Recycle from './components/Recycle';
import HarithaKarmaSenaSignUp from './components/HarithaKarmaSenaSignUp';
import HarithaKarmaSenaLogin from './components/HarithaKarmaSenaLogin';
import HarithaKarmaSenaView from './components/HarithaKarmaSenaView';
import UserProfile from './components/UserProfile';
import UserView from './components/UserView';


function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<UserSignUp />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/calculator" element={<PlasticWasteCalculator />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/upload" element={<WasteUpload />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/adminview" element={<AdminView />} />
        <Route path="/recycle" element={<Recycle />} />
        <Route path="/hks_signup" element={<HarithaKarmaSenaSignUp />} />
        <Route path="/hks_login" element={<HarithaKarmaSenaLogin />} />
        <Route path="/hks_view" element={<HarithaKarmaSenaView />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/view" element={<UserView />} />
      </Routes>
    </Router>
  );
}

export default App;

