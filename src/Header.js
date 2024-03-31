import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from './context/AuthContext'; // Adjust the path based on your project structure
import logoImg from './logo.png';
import gprofilePic from './profile.png';
import './Dashboard.css'; // Adjust the CSS path if necessary
import { auth, db } from './firebase-config'; // Adjust the path based on your project structure

const Header = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        // Fetch user details only if currentUser is available
        const fetchUserDetails = async () => {
            if (currentUser) {
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUserDetails(docSnap.data());
                } else {
                    console.log("No such document!");
                }
            }
        };

        fetchUserDetails();
    }, [currentUser]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const goToProfile = () => {
        navigate('/profile');
    };

    return (
        <header className="dashboard-header">
            <div className="header-content">
                <div className="logo">
                    <img src={logoImg} alt="Logo" />
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
    );
};

export default Header;
