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
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails } from './userSlice';

const Header = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const dispatch = useDispatch();
    const userDetails = useSelector((state) => state.user.userDetails);

    useEffect(() => {
        if (currentUser) {
            dispatch(fetchUserDetails(currentUser.uid));
        }
    }, [currentUser, dispatch]);


    const navigateToDashboard = () => {
        navigate('/dashboard'); // Navigate to the dashboard route
      };
    
 
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
                 <div className="logo" onClick={navigateToDashboard}>
            <img src={logoImg} alt="Logo" style={{cursor: 'pointer'}} />
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
