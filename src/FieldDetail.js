import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "./firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Tabs, Button, Form, Input, InputNumber, message } from "antd"; // Add message to imports
import { ArrowLeftOutlined } from "@ant-design/icons";
import Header from "./Header";
import CropView from "./CropView";
import InspectionsView from "./InspectionsView";
import MapFieldComponent from "./MapFieldComponent"; // Assume this component is ready for use
import "./FieldDetail.css";

const { TabPane } = Tabs;
const { TextArea } = Input;

const FieldDetail = () => {
  const navigate = useNavigate();
  const { farmId, fieldId } = useParams();
  const [fieldDetails, setFieldDetails] = useState({});
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchFieldDetails = async () => {
      if (!farmId || !fieldId) return;
      const fieldRef = doc(db, "farms", farmId, "fields", fieldId);
      try {
        const docSnap = await getDoc(fieldRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFieldDetails(data);
          form.setFieldsValue(data); // Set form fields
        } else {
          setFieldDetails({ name: "Field not found" });
        }
      } catch (error) {
        console.error("Error fetching field details:", error);
        setFieldDetails({ name: "Error fetching details" });
      }
    };

    fetchFieldDetails();
  }, [farmId, fieldId, form]);

  const handleFormSubmit = async (values) => {
    const fieldRef = doc(db, "farms", farmId, "fields", fieldId);
    try {
      await updateDoc(fieldRef, values);
      message.success("Field details updated!");
    } catch (error) {
      console.error("Error updating field details:", error);
      message.error("Failed to update field details.");
    }
  };

  const handleBoundaryChange = async (newBoundary) => {
    const fieldRef = doc(db, "farms", farmId, "fields", fieldId);
    try {
      await updateDoc(fieldRef, { boundary: newBoundary });
      setFieldDetails((prevDetails) => ({
        ...prevDetails,
        boundary: newBoundary,
      }));
    } catch (error) {
      console.error("Error updating boundary:", error);
      message.error("Failed to update boundary.");
    }
  };

  return (
    <div>
      <Header />
      <div className="field-detail-header">
        <ArrowLeftOutlined onClick={() => navigate(-1)} style={{ marginRight: 16, cursor: "pointer" }} />
        <span style={{ flex: 1 }}>
          <h2>{fieldDetails.name}</h2>
        </span>
      </div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Crops" key="1">
          <CropView fieldId={fieldId} />
        </TabPane>
        <TabPane tab="Inspections" key="2">
          <InspectionsView fieldId={fieldId} />
        </TabPane>
        <TabPane tab="Field Info" key="4">
          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
            <Form.Item name="name" label="Field Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="acres" label="Acres">
              <InputNumber />
            </Form.Item>
            <Form.Item name="notes" label="Notes">
              <TextArea rows={4} />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Save Field Info
            </Button>
          </Form>
          <MapFieldComponent onBoundaryChange={handleBoundaryChange} initialBoundary={fieldDetails.boundary} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default FieldDetail;
