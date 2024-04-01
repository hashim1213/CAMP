import { useEffect, useState } from 'react';
import { Form, Input, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useAuth } from './context/AuthContext';
import { updateProfile, uploadProfilePic } from './firebase-helpers';
import './Profile.css';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase-config';
// Import the necessary functions from Firebase
import { doc, getDoc } from 'firebase/firestore';

const Profile = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
  
    useEffect(() => {
      const fetchUserDetails = async () => {
        if (currentUser && currentUser.uid) {
          // Use the new Firebase v9 modular syntax
          const docRef = doc(db, "users", currentUser.uid); // Access the document reference
          const docSnap = await getDoc(docRef); // Get the document snapshot
          if (docSnap.exists()) {
            const userData = docSnap.data();
            form.setFieldsValue({
              name: userData.name,
              role: userData.role,
              phone: userData.phone,
              address: userData.address,
              
            });
            // Handle setting existing profile picture if available
            if (userData.profilePic) {
              setFileList([{uid: '-1', name: 'profilePic.png', status: 'done', url: userData.profilePic}]);
            }
          } else {
            console.log("No user data available");
          }
        }
      };
  
      if (currentUser) {
        fetchUserDetails();
      }
    }, [currentUser, form]);

    const handleUpdateProfile = async (values) => {
      let profilePicUrl = '';
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const file = fileList[0].originFileObj; // Ensure this object exists and is correct
        profilePicUrl = await uploadProfilePic(currentUser.uid, file);
      } else {
        console.error("No file selected for upload.");
      }
    
      try {
        await updateProfile(currentUser.uid, values.name, profilePicUrl,values.role, values.phone, values.address);
        console.log("Profile updated successfully.");
        navigate('/dashboard');
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    };
    

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <div className="profile-page">
      <Header /> {/* Use the Header here */}

      <div className="profile-content">
        <Button className="back-btn" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>

        <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input your name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>
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
    </div>
  );
};

export default Profile;
