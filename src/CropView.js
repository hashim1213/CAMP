import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, DatePicker, Modal, message, Card } from 'antd';

const CropView = () => {
    const { fieldId } = useParams();
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [crops, setCrops] = useState([]);
  
    const showModal = () => setIsModalVisible(true);
    const handleCancel = () => setIsModalVisible(false);
  
    const onFinish = async (values) => {
      console.log(values);
      message.success('Crop details added successfully!');
      // Integrate with your backend here, for example, add details to Firestore
      setCrops([...crops, values]);
      setIsModalVisible(false); // Close the modal after submission
      form.resetFields(); // Reset form fields after submission
    };
  
    return (
      <>
        <Button type="primary" onClick={showModal}>
          Add Crop
        </Button>
        <Modal title="Add Crop Details" visible={isModalVisible} onCancel={handleCancel} footer={null}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              name="cropName"
              label="Crop Name"
              rules={[{ required: true, message: 'Please input the crop name!' }]}
            >
              <Input placeholder="E.g., Wheat" />
            </Form.Item>
  
            <Form.Item
              name="plantingDate"
              label="Planting Date"
              rules={[{ required: true, message: 'Please select the planting date!' }]}
            >
              <DatePicker />
            </Form.Item>
  
            <Form.Item
              name="fertilizer"
              label="Fertilizer Used"
            >
              <Input placeholder="E.g., Nitrogen-based" />
            </Form.Item>
  
            <Form.Item
              name="cropProtection"
              label="Crop Protection Details"
            >
              <Input.TextArea rows={4} placeholder="Details about crop protection measures" />
            </Form.Item>
  
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add Crop Details
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        {crops.map((crop, index) => (
          <Card key={index} title={crop.cropName} style={{ marginTop: 16 }}>
            <p>Planting Date: {crop.plantingDate.format('YYYY-MM-DD')}</p>
            <p>Fertilizer Used: {crop.fertilizer}</p>
            <p>Crop Protection Details: {crop.cropProtection}</p>
          </Card>
        ))}
      </>
    );
  };
  
  export default CropView;
  