import { useEffect, useState } from "react";
import { Form, Input, Button, Upload, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useAuth } from "./context/AuthContext";
import { updateProfile, uploadProfilePic } from "./firebase-helpers";
import "./Profile.css";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase-config";
import { doc, getDoc } from "firebase/firestore";

const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const { Option } = Select;

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (currentUser?.uid) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          const [firstName, lastName] = userData.name?.split(" ") || ["", ""];

          form.setFieldsValue({
            firstName,
            lastName,
            role: userData.role,
            phone: userData.phone,
            ...userData.address,
          });

          if (userData.profilePic) {
            setFileList([{ uid: "-1", name: "profilePic.png", status: "done", url: userData.profilePic }]);
          }
        } else {
          console.log("No user data available");
        }
      }
    };

    fetchUserDetails();
  }, [currentUser, form]);

  const handleUpdateProfile = async (values) => {
    try {
      let profilePicUrl = "";
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const uploadResponse = await uploadProfilePic(currentUser.uid, fileList[0].originFileObj);
        profilePicUrl = uploadResponse;
      }

      const fullName = `${values.firstName} ${values.lastName}`;
      const userDetails = {
        name: fullName,
        role: values.role,
        phone: values.phone || "",
        address: {
          city: values.city || "",
          province: values.province || "",
          country: values.country || "",
          postalCode: values.postalCode || "",
          poBox: values.poBox || "",
        },
        // Only include profilePic in userDetails if a new picture was successfully uploaded
        ...(profilePicUrl && { profilePic: profilePicUrl }),
      };
      
      await updateProfile(currentUser.uid, userDetails);
      console.log("Profile updated successfully.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      // Consider adding user-facing error handling here
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1)); // Keep only the last selected file
  };


  return (
    <div className="profile-page">
      <Header />
   

      <div className="button-container">
        {" "}
        <Button className="back-btn" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      <div className="profile-content">
        {fileList.length > 0 && (
          <div className="profile-pic-preview">
            <img
              src={fileList[0].url}
              alt="Profile Pic"
              style={{ width: 100, height: 100, borderRadius: "50%" }}
            />
          </div>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateProfile}
          className="profile-form"
        >
          <div className="name-fields">
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[
                { required: true, message: "Please input your first name!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last Name"
              
            >
              <Input />
            </Form.Item>
          </div>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select your role!" }]}
          >
            <Select placeholder="Select a role">
              <Option value="salesLeader">Sales Leader</Option>
              <Option value="sales">Sales</Option>
              <Option value="operations">Operations</Option>
              <Option value="agronomist">Agronomist</Option>
              <Option value="producer">Producer</Option>
              <Option value="corporate">Corporate</Option>
              <Option value="marketing">Marketing</Option>
            </Select>
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          {/* Address */}
          <div className="address-fields">
            <Form.Item name="city" label="City/Town">
              <Input />
            </Form.Item>
            <Form.Item name="province" label="Province/State">
              <Input />
            </Form.Item>
            <Form.Item name="country" label="Country">
              <Input />
            </Form.Item>
            <Form.Item name="postalCode" label="Postal Code">
              <Input />
            </Form.Item>
            <Form.Item name="poBox" label="P.O. Box">
              <Input />
            </Form.Item>
          </div>
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
