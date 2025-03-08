import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import LandingPage from './landing_page/LandingPage';
import LoginPage from './login_page/LoginPage';
import SignupPage from './login_page/SignupPage';
import Dashboard from './main_page/Dashboard';
import ProjectDetail from './main_page/ProjectDetail'; // Import the new ProjectDetail component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} exact />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/project/:projectId" element={<ProjectDetail />} /> {/* Add the new route for project details */}
      </Routes>
    </Router>
  );
};

export default App;