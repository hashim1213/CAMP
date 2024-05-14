import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "./firebase-config";
import { doc, getDoc, updateDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { Form, Input, Button, Card, Select, Checkbox, Modal, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Header from "./Header";
import "./FarmInfoView.css";

const { TextArea } = Input;
const { Option } = Select;

const FarmInfoView = () => {
  const navigate = useNavigate();
  const { farmId } = useParams();
  const [farmInfo, setFarmInfo] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isShareEnabled, setIsShareEnabled] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchFarmDetails = async () => {
      const farmRef = doc(db, "farms", farmId);
      const farmSnap = await getDoc(farmRef);
      if (farmSnap.exists()) {
        const data = farmSnap.data();
        setFarmInfo(data);
        form.setFieldsValue(data);
        if (data.sharedWith) {
          setSelectedMembers(data.sharedWith);
          setIsShareEnabled(data.sharedWith.length > 0);
        }
      } else {
        console.log("No such farm!");
      }
    };

    const fetchTeamMembers = async () => {
      const membersCollectionRef = collection(db, "users");
      const membersSnapshot = await getDocs(membersCollectionRef);
      setTeamMembers(membersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchFarmDetails();
    fetchTeamMembers();
  }, [farmId, form]);

  const updateFarmInfo = async (values) => {
    const updatedFarmInfo = {
      ...values,
      sharedWith: isShareEnabled ? selectedMembers : [],
    };
    const farmRef = doc(db, "farms", farmId);
    try {
      await updateDoc(farmRef, updatedFarmInfo);
      message.success("Farm details updated successfully!");
      navigate(`/fields/${farmId}`);
    } catch (error) {
      console.error("Error updating document: ", error);
      message.error("Failed to update farm details.");
    }
  };

  const handleDeleteFarm = async () => {
    const farmRef = doc(db, "farms", farmId);
    try {
      await deleteDoc(farmRef);
      message.success("Farm deleted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting farm: ", error);
      message.error("Failed to delete farm.");
    }
  };

  const confirmDelete = () => {
    Modal.confirm({
      title: "Are you sure you want to delete this farm?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: handleDeleteFarm,
    });
  };

  const handleShareChange = (e) => {
    setIsShareEnabled(e.target.checked);
    if (!e.target.checked) {
      setSelectedMembers([]);
    }
  };

  return (
    <div>
      <Header />
      <div className="farm-info-header">
        <ArrowLeftOutlined
          onClick={() => navigate(-1)}
          style={{ marginRight: 16, cursor: "pointer" }}
        />
        <h2>Edit Farm Info</h2>
      </div>
      <Card className="farm-info-card">
        <Form form={form} onFinish={updateFarmInfo} layout="vertical">
          <Form.Item name="name" label="Farm Name" rules={[{ required: true, message: "Please input the farm name!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="share" valuePropName="checked">
            <Checkbox onChange={handleShareChange} checked={isShareEnabled}>
              Share with team
            </Checkbox>
          </Form.Item>
          {isShareEnabled && (
            <Form.Item name="sharedWith" initialValue={selectedMembers}>
              <Select
                mode="multiple"
                placeholder="Select team members"
                onChange={setSelectedMembers}
                value={selectedMembers}
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
              Save
            </Button>
            <Button type="danger" onClick={confirmDelete} style={{ marginLeft: "10px" }}>
              Delete
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default FarmInfoView;
