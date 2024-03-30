import React, { useState } from 'react';
import { Modal, Button, Form, Input, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useAuth } from './context/AuthContext'; // Adjust the import path as necessary
import { updateProfile, uploadProfilePic } from './firebase-helpers'; // Adjust the import path as necessary
import gprofilePic from './profile.png';

const ProfileModal = ({ userDetails, setUserDetails }) => {
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { currentUser } = useAuth();

  const handleProfileModalOk = async () => {
    try {
      const values = await form.validateFields();
      let profilePicUrl = userDetails?.profilePic;

      // Assuming you handle file upload elsewhere and pass the URL back
      if (values.file) {
        const file = values.file.file.originFileObj;
        profilePicUrl = await uploadProfilePic(currentUser.uid, file);
      }

      // Update the profile in your backend or Firebase
      await updateProfile(currentUser.uid, values.name, profilePicUrl, values.phone, values.address);

      // Update local state if necessary
      setUserDetails(prev => ({ ...prev, ...values, profilePic: profilePicUrl }));

      console.log("Profile updated");
      setIsProfileModalVisible(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleProfileModalCancel = () => {
    setIsProfileModalVisible(false);
  };

  // Function to show the modal
  const showModal = () => {
    setIsProfileModalVisible(true);
    // Prepopulate form with existing userDetails
    form.setFieldsValue({ name: userDetails.name, phone: userDetails.phone, address: userDetails.address });
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Edit Profile
      </Button>
      <Modal
        title="Edit Profile"
        open={isProfileModalVisible}
        onOk={handleProfileModalOk}
        onCancel={handleProfileModalCancel}
        footer={[
          <Button key="back" onClick={handleProfileModalCancel}>Return</Button>,
          <Button key="submit" type="primary" onClick={handleProfileModalOk}>Save</Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          {/* Form Items */}
        </Form>
      </Modal>
    </>
  );
};

export default ProfileModal;
