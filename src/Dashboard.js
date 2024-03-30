import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import 'leaflet/dist/leaflet.css';
import MapView from './MapView';
import FarmView from './FarmView';
import logoImg from './logo.png';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase-config';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { doc, getDoc } from "firebase/firestore";
import gprofilePic from './profile.png';

const Dashboard = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login'); // Redirect to login if not authenticated
        } else {
            // Fetch user details only if currentUser is available
            const fetchUserDetails = async () => {
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUserDetails(docSnap.data());
                } else {
                    console.log("No such document!");
                }
            };

            fetchUserDetails();
        }
    }, [currentUser, navigate]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("Logged out successfully");
            navigate('/login');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const goToProfile = () => {
        navigate('/profile'); // Navigate to the profile page
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="logo">
                        <img src={logoImg} alt="Cargill" />
                    </div>
                    <div className="user-info" onClick={goToProfile}>
                        <img src={userDetails?.profilePic || gprofilePic} alt="Profile" className="user-profile-pic" />
                        <span className="user-name">{userDetails?.name || 'Guest'}</span>
                        <button className="notifications-btn">Notifications</button>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
                <div className="search-bar">
                    <input type="text" placeholder="Search fields..." />
                </div>
            </header>

            <main className="content">
                <div><FarmView /></div>
            </main>

            <footer className="dashboard-footer">
                <div className="footer-content">
                    © {new Date().getFullYear()} Crop Management Platform. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
