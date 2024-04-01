import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from './context/AuthContext';
import logoImg from './logo.png';
import gprofilePic from './profile.png';
import './Dashboard.css';
import { auth, db } from './firebase-config';
import { Menu, Dropdown } from 'antd';
import { BellOutlined, PoweroffOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';

const Header = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
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
    const profileMenu = (
        <Menu>
            <Menu.Item key="1" icon={<EditOutlined />} onClick={goToProfile}>
                Edit Profile
            </Menu.Item>
            <Menu.Item key="2" icon={<PoweroffOutlined />} onClick={handleLogout}>
                Logout
            </Menu.Item>
        </Menu>
    );

    const notificationMenu = (
        <Menu>
            {/* Populate with actual notifications */}
            <Menu.Item key="1">Notification 1</Menu.Item>
            <Menu.Item key="2">Notification 2</Menu.Item>
        </Menu>
    );

    return (
        <header className="dashboard-header">
            <div className="header-content">
                <div className="logo">
                    <img src={logoImg} alt="Logo" />
                </div>
                <div className="search-bar">
                    <input type="text" placeholder="Search fields..." />
                </div>
                <div className="user-actions">
                    <Dropdown overlay={notificationMenu} trigger={['click']}>
                        <BellOutlined className="icon-action notification-bell" />
                    </Dropdown>
                    <div className="user-info">
                        <Dropdown overlay={profileMenu} trigger={['click']} placement="bottomLeft" arrow={{ pointAtCenter: true }}>
                            <img src={userDetails?.profilePic || gprofilePic} alt="Profile" className="user-profile-pic" />
                        </Dropdown>
                        <div className="user-details">
                            <span className="user-name">{userDetails?.name || 'Guest'}</span>
                            <span className="user-role">{userDetails?.role || 'Role'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
