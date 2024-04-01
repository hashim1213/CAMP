import React, { useEffect, useState } from 'react';
import { db } from './firebase-config';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from './context/AuthContext';
import FarmCard from './FarmCard';
import './FarmView.css';
import { Modal, Button, Form, Input, Checkbox, Select } from 'antd';
import MapView from './MapView';

const { Option } = Select;

const FarmView = () => {
    const { currentUser } = useAuth();
    const [currentView, setCurrentView] = useState('allSites');
    const [farms, setFarms] = useState([]);
    const [filteredFarms, setFilteredFarms] = useState([]); // Declare filteredFarms and its setter
    const [isAddFarmModalVisible, setIsAddFarmModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [isShareEnabled, setIsShareEnabled] = useState(false);
    const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
      // Fetch farms either created by the user or shared with the user
      const fetchFarms = async () => {
        const createdFarmsRef = query(collection(db, "farms"), where("createdBy", "==", currentUser.uid));
        const sharedFarmsRef = query(collection(db, "farms"), where("sharedWith", "array-contains", currentUser.uid));
    
        const [createdFarmsSnap, sharedFarmsSnap] = await Promise.all([
            getDocs(createdFarmsRef),
            getDocs(sharedFarmsRef),
        ]);
    
        let farmsData = [];
        const createdFarms = createdFarmsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const sharedFarms = sharedFarmsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const allFarms = Array.from(new Set([...createdFarms, ...sharedFarms].map(JSON.stringify))).map(JSON.parse);
    
        for (const farm of allFarms) {
            const fieldsCollectionRef = collection(db, "farms", farm.id, "fields");
            const fieldsSnap = await getDocs(fieldsCollectionRef);
            const fields = fieldsSnap.docs.map(doc => doc.data());
            const numberOfFields = fields.length;
            const totalAcres = fields.reduce((acc, field) => acc + field.acres, 0);
            
            farmsData.push({
                ...farm,
                numberOfFields,
                totalAcres,
            });
        }
    
        setFarms(farmsData);
    };
    
    useEffect(() => {
        fetchFarms();
    }, [currentUser]);

    // Fetch all users for team member selection
    useEffect(() => {
        const fetchUsers = async () => {
            const querySnapshot = await getDocs(collection(db, "users"));
            const users = querySnapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
            }));
            setTeamMembers(users);
        };

        fetchUsers();
    }, []);


    const handleShareChange = e => {
        setIsShareEnabled(e.target.checked);
    };

    const handleTeamMemberSelect = value => {
        setSelectedTeamMembers(value);
    };

    const showAddFarmModal = () => {
        setIsAddFarmModalVisible(true);
    };
    // Fetch all users for the sharing functionality
 
      
    const handleAddFarm = async (values) => {
        // Define the farm data with fields filled from the form
        const farmData = {
            ...values,
            createdBy: currentUser.uid, // Assuming currentUser contains the uid of the logged-in user
            // If sharing is enabled and team members are selected, use selectedTeamMembers,
            // otherwise, default to an array containing only the current user's uid
            sharedWith: isShareEnabled && selectedTeamMembers.length > 0 ? selectedTeamMembers : [currentUser.uid]
        };
    
        try {
            // Attempt to add the new farm data to the "farms" collection
            await addDoc(collection(db, 'farms'), farmData);
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
    
    
    


    const handleCancel = () => setIsAddFarmModalVisible(false);
  const applyFilter = () => {
        // Example filter: show only farms with 'Farm' in the name
        const filtered = farms.filter(farm => farm.name.includes('Farm'));
        setFilteredFarms(filtered);
    };
  

    return (
        <div className="farms-container">
            <div className="view-options-container">
                <Button className="view-option" onClick={() => setCurrentView('map')}>Map</Button>
                <Button className="view-option" onClick={() => setCurrentView('allSites')}>All Sites</Button>
                <Button className="filter-btn" onClick={applyFilter}>Filter</Button>
            </div>
            <div className="add-farm-container">
                <Button className="add-farm-btn" onClick={showAddFarmModal}>Quick Add</Button>
                <Button className="add-farm-btn" onClick={showAddFarmModal}>Add Farm</Button>
            </div>

          {currentView === 'map' && <MapView farms={farms} />}
          {currentView === 'allSites' && (
           <div className="farms-grid">
           {farms.map(farm => (
               <FarmCard key={farm.id} farm={farm} teamMembers={teamMembers} numberOfFields={farm.numberOfFields} totalAcres={farm.totalAcres} />
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
              <Checkbox onChange={(e) => setIsShareEnabled(e.target.checked)}>Share with team</Checkbox>
            </Form.Item>
            {isShareEnabled && (
  <Form.Item name="sharedWith">
    <Select
      mode="multiple"
      placeholder="Select team members"
      onChange={handleTeamMemberSelect}
      value={selectedTeamMembers} // Ensure the value is always an array
    >
      {teamMembers.map(member => (
        <Option key={member.id} value={member.id}>{member.name}</Option>
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

