import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './Login'; // Ensure paths are correct
import Signup from './Signup';
import Profile from './Profile';
import './App.css';
import { Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import 'leaflet/dist/leaflet.css';
import FarmView from './FarmView';
import FieldsView from './FieldsView';
import NotFound from './NotFound';
import FieldDetail from './FieldDetail';
import TeamSlideOut from './TeamSlideOut';
import { Provider } from 'react-redux'; // Import from react-redux
import { store } from './store'; // Ensure the store path is correct

// Function Component for Home (Placeholder)
import styled from 'styled-components';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  font-family: 'Arial', sans-serif;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #ffffff;
  margin-bottom: 2rem;
  
`;

const Navigation = styled.nav`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 1rem 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StyledLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  font-weight: bold;
  margin: 0 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

function Home() {
  return (
    <HomeContainer>
      <Title>Welcome to CAMP</Title>
      <Navigation>
        <StyledLink to="/login">Login</StyledLink> | <StyledLink to="/signup">Signup</StyledLink>
      </Navigation>
      {/* Any additional home page content */}
    </HomeContainer>
  );
}

function App() {
  return (
    <Provider store={store}> {/* Wrap Router with Provider and pass in the store */}
      <Router>
        <AuthProvider>
          <TeamSlideOut />
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} /> {/* Home component placeholder */}
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
    </Provider>
  );
}

export default App;
