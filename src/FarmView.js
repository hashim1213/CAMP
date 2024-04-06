import React, { useEffect, useState } from "react";
import { db } from "./firebase-config";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "./context/AuthContext";
import FarmCard from "./FarmCard";
import "./FarmView.css";
import { Modal, Button, Form, Input, Checkbox, Select } from "antd";
import MapView from "./MapView";
import { useSelector, useDispatch } from 'react-redux';
import { fetchFarms } from './farmsSlice';
const { Option } = Select;

const FarmView = () => {
 // const { currentUser } = useAuth();
  const [currentView, setCurrentView] = useState("allSites");
  //const [farms, setFarms] = useState([]);
  const [filteredFarms, setFilteredFarms] = useState([]); // Declare filteredFarms and its setter
  const [isAddFarmModalVisible, setIsAddFarmModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isShareEnabled, setIsShareEnabled] = useState(false);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const dispatch = useDispatch();
  const { currentUser } = useAuth();

  const farms = useSelector((state) => state.farms.items);
  const farmStatus = useSelector((state) => state.farms.status);
  const error = useSelector((state) => state.farms.error);

  useEffect(() => {
    if (farmStatus === 'idle') {
      dispatch(fetchFarms(currentUser.uid));
    }
  }, [currentUser, farmStatus, dispatch]);

  const handleShareChange = (e) => setIsShareEnabled(e.target.checked);
  const handleTeamMemberSelect = (value) => setSelectedTeamMembers(value);
  const showAddFarmModal = () => setIsAddFarmModalVisible(true);
  const handleCancel = () => setIsAddFarmModalVisible(false);

  const handleAddFarm = async (values) => {
    const farmData = {
      ...values,
      createdBy: currentUser.uid, 
      sharedWith:
        isShareEnabled && selectedTeamMembers.length > 0
          ? selectedTeamMembers
          : [currentUser.uid],
    };
    try {
      // Attempt to add the new farm data to the "farms" collection
      await addDoc(collection(db, "farms"), farmData);
      console.log("Farm added successfully");

      // Close the modal and reset the form upon successful addition
      setIsAddFarmModalVisible(false);
      form.resetFields();

      // Refresh the list of farms displayed
      fetchFarms();
    } catch (error) {
      // Log any errors that occur during the add operation
      console.error("Error adding farm: ", error);
    }
  };
  return (
    <div className="farms-container">
      <div className="view-options-container">
        <Button className="view-option" onClick={() => setCurrentView("map")}>
          Map
        </Button>
        <Button
          className="view-option"
          onClick={() => setCurrentView("allSites")}
        >
          All Sites
        </Button>
        <Button className="view-option" onClick={() => setCurrentView("Tasks")}>
          Tasks
        </Button>
        <Button
          className="view-option"
          onClick={() => setCurrentView("Calandar")}
        >
          Calandar
        </Button>
       
      </div>
      <div className="add-farm-container">
        <Button className="add-farm-btn" onClick={showAddFarmModal}>
          Quick Add
        </Button>
        <Button className="add-farm-btn" onClick={showAddFarmModal}>
          Add Farm
        </Button>
      </div>

      {currentView === "map" && <MapView farms={farms} />}
      {currentView === "allSites" && (
        <div className="farms-grid">
          {farms.map((farm) => (
            <FarmCard
              key={farm.id}
              farm={farm}
              teamMembers={teamMembers}
              numberOfFields={farm.numberOfFields}
              totalAcres={farm.totalAcres}
            />
          ))}
        </div>
      )}
      <Modal
        title="Add New Farm"
        visible={isAddFarmModalVisible}
        onCancel={() => setIsAddFarmModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddFarm}>
          <Form.Item name="name" label="Farm Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="contactName"
            label="Contact Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="share" valuePropName="checked">
            <Checkbox onChange={(e) => setIsShareEnabled(e.target.checked)}>
              Share with team
            </Checkbox>
          </Form.Item>
          {isShareEnabled && (
            <Form.Item name="sharedWith">
              <Select
                mode="multiple"
                placeholder="Select team members"
                onChange={handleTeamMemberSelect}
                value={selectedTeamMembers} // Ensure the value is always an array
              >
                {teamMembers.map((member) => (
                  <Option key={member.id} value={member.id}>
                    {member.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FarmView;
