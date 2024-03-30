import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useAuth } from './context/AuthContext';
import { updateProfile, uploadProfilePic } from './firebase-helpers';
import './Profile.css';
import logoImg from './logo.png'; // Ensure you have this image in your project
import gprofilePic from './profile.png'; // Default profile picture
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase-config'; // Adjust import paths as needed
import { doc, getDoc } from 'firebase/firestore';

const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  useEffect(() => {
    const fetchUserDetails = async () => {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserDetails(docSnap.data());
      } else {
        console.log("No user data available");
      }
    };

    if (currentUser) {
      fetchUserDetails();
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleUpdateProfile = async (values) => {
    let profilePicUrl = '';
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      profilePicUrl = await uploadProfilePic(currentUser.uid, file);
    }

    try {
      await updateProfile(currentUser.uid, values.name, profilePicUrl, values.phone, values.address);
      console.log("Profile updated successfully.");
      navigate('/dashboard');
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  
  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="profile-page">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">
            <img src={logoImg} alt="Logo" />
          </div>
          <div className="user-info" onClick={goToDashboard}>
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

      <Button className="back-btn" onClick={goToDashboard}>Back to Dashboard</Button>

      <Form form={form} layout="vertical" onFinish={handleUpdateProfile} initialValues={{...userDetails}}>
        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input your name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Phone">
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Address">
          <Input />
        </Form.Item>
        {/* Profile Picture Upload logic here */}
        <Form.Item
          name="upload"
          label="Profile Picture"
          valuePropName="fileList"
          getValueFromEvent={handleUploadChange}
        >
          <Upload
            name="file"
            listType="picture"
            beforeUpload={() => false}
            onChange={handleUploadChange}
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
       
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update Profile
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Profile;
