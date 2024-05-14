import React, { useState } from "react";
import { Form, Input, Button, Select, InputNumber, Modal } from "antd";
import MapFieldComponent from "./MapFieldComponent"; // Make sure this component is properly set up
import "leaflet/dist/leaflet.css";

const { TextArea } = Input;
const { Option } = Select;

const AddFieldModal = ({ isVisible, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [boundaryData, setBoundaryData] = useState(null); // State to hold boundary data

  // Function to handle form submission
  const handleSubmit = async () => {
    await form.validateFields().then((values) => {
      const submissionData = {
        ...values,
        boundary: JSON.stringify(boundaryData), // Include boundary data in the submission
      };
      onSubmit(submissionData); // Pass the submission data to the onSubmit function
      form.resetFields(); // Reset form fields after submission
      setIsMapVisible(false); // Hide the map modal
      setBoundaryData(null); // Reset boundary data
    });
  };

  // Function to handle boundary data submission from the map
  const handleMapSubmit = (boundary) => {
    setBoundaryData(boundary); // Update the boundary data state
    form.setFieldsValue({ boundary: JSON.stringify(boundary) }); // Update the form field with boundary data
    setIsMapVisible(false); // Hide the map modal after saving boundary
  };

  return (
    <Modal
      title="Add New Field"
      visible={isVisible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Field Name"
          rules={[{ required: true, message: "Please enter the field name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="address"
          label="Address"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="acres"
          label="Acres"
          rules={[{ required: true, message: "Please enter the size in acres" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="soilType"
          label="Soil Type"
          rules={[{ required: true, message: "Please select the soil type" }]}
        >
          <Select placeholder="Select soil type">
            <Option value="loamy">Loamy</Option>
            <Option value="clay">Clay</Option>
            <Option value="sandy">Sandy</Option>
            <Option value="peaty">Peaty</Option>
            <Option value="silty">Silty</Option>
            <Option value="chalky">Chalky</Option>
          </Select>
        </Form.Item>
        <Form.Item name="notes" label="Additional Notes">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button onClick={() => setIsMapVisible(true)}>Open Map to Define Boundary</Button>
        </Form.Item>
        <Form.Item name="boundary" label="Field Boundary">
          <Input placeholder="Boundary data will be filled after using the map." disabled value={boundaryData ? JSON.stringify(boundaryData) : ''} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Submit</Button>
          <Button onClick={onCancel} style={{ marginLeft: "10px" }}>Cancel</Button>
        </Form.Item>
      </Form>
      <Modal
        title="Define Field Boundary"
        visible={isMapVisible}
        onCancel={() => setIsMapVisible(false)}
        width="90%"
        footer={null}
      >
        <MapFieldComponent onSubmit={handleMapSubmit} />
      </Modal>
    </Modal>
  );
};

export default AddFieldModal;
