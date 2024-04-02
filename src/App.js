import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './Login'; // Adjust the path as necessary
import Signup from './Signup';
import Profile from './Profile'; // Adjust the path as necessary
import './App.css';
import { Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import 'leaflet/dist/leaflet.css';
import FarmView from './FarmView';
import FieldsView from './FieldsView';
import NotFound from './NotFound';
import FieldDetail from './FieldDetail';
import TeamSlideOut from './TeamSlideOut';
function App() {
  return (
    <Router>
      <AuthProvider>
      <TeamSlideOut />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} /> {/* Home component not defined yet */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/farms/:farmId" element={<FarmView />} />
          <Route path="/profile" element={<Profile />} />      
          <Route path="/farms/:farmId/fields" element={<FieldsView />} />
          <Route path="/fields/:fieldId" element={<FieldDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      </AuthProvider>
    </Router>
  );
}

// Placeholder Home component
function Home() {
  return (
    <div>
      <h1>Welcome to CAMP</h1>
      <nav>
        <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
      </nav>
      {/* Any additional home page content */}
    </div>
  );
}

export default App;
