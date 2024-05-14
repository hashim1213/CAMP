import React, { useEffect, useState } from "react";
import { db } from "./firebase-config";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useAuth } from "./context/AuthContext";
import FarmCard from "./FarmCard";
import "./FarmView.css";
import { Modal, Button, Form, Input, Checkbox, Select, message } from "antd";
import MapView from "./MapView";
import { useSelector, useDispatch } from 'react-redux';
import { fetchFarms } from './farmsSlice';
const { Option } = Select;

const FarmView = () => {
  const [currentView, setCurrentView] = useState("allSites");
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
    fetchTeamMembers();
  }, [currentUser, farmStatus, dispatch]);

  const fetchTeamMembers = async () => {
    try {
      const membersSnapshot = await getDocs(collection(db, "users"));
      const membersList = membersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTeamMembers(membersList);
    } catch (error) {
      console.error("Error fetching team members: ", error);
      message.error("Failed to fetch team members.");
    }
  };

  const handleShareChange = (e) => setIsShareEnabled(e.target.checked);
  const handleTeamMemberSelect = (value) => setSelectedTeamMembers(value);
  const showAddFarmModal = () => setIsAddFarmModalVisible(true);
  const handleCancel = () => {
    setIsAddFarmModalVisible(false);
    form.resetFields();
    setIsShareEnabled(false);
    setSelectedTeamMembers([]);
  };

  const handleAddFarm = async (values) => {
    const farmData = {
      ...values,
      createdBy: currentUser.uid,
      sharedWith: isShareEnabled && selectedTeamMembers.length > 0
        ? selectedTeamMembers
        : [currentUser.uid],
    };

    try {
      await addDoc(collection(db, "farms"), farmData);
      console.log("Farm added successfully");
      setIsAddFarmModalVisible(false);
      form.resetFields();
      dispatch(fetchFarms(currentUser.uid)); // Refetch farms after adding a new one
    } catch (error) {
      console.error("Error adding farm: ", error);
      message.error("Failed to add farm.");
    }
  };

  return (
    <div className="farms-container">
      <div className="view-options-container">
        <Button className="view-option" onClick={() => setCurrentView("map")}>
          Map
        </Button>
        <Button className="view-option" onClick={() => setCurrentView("allSites")}>
          All Sites
        </Button>
        <Button className="view-option" onClick={() => setCurrentView("Tasks")}>
          Tasks
        </Button>
        <Button className="view-option" onClick={() => setCurrentView("Calendar")}>
          Calendar
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
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddFarm}>
          <Form.Item name="name" label="Farm Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="contactName" label="Contact Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Phone Number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="share" valuePropName="checked">
            <Checkbox onChange={handleShareChange}>
              Share with team
            </Checkbox>
          </Form.Item>
          {isShareEnabled && (
            <Form.Item name="sharedWith">
              <Select
                mode="multiple"
                placeholder="Select team members"
                onChange={handleTeamMemberSelect}
                value={selectedTeamMembers}
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
