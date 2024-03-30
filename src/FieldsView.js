import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase-config';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Form, Input, Button, Select, InputNumber, Card, Row, Col } from 'antd';
import './FieldsView.css'; // Make sure your CSS file is imported
import { Modal } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const FieldsView = () => {
    const { farmId } = useParams();
    const [fields, setFields] = useState([]);
    const [form] = Form.useForm();
    const [isAddFieldModalVisible, setIsAddFieldModalVisible] = useState(false);

    const fetchFields = async () => {
      const fieldsCollectionRef = collection(db, "farms", farmId, "fields");
      const data = await getDocs(fieldsCollectionRef);
      setFields(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    const showAddFieldModal = () => {
        setIsAddFieldModalVisible(true);
      };
      
      const handleAddFieldCancel = () => {
        setIsAddFieldModalVisible(false);
      };
      
  
    useEffect(() => {
      fetchFields();
    }, [farmId]);
  
    const addField = async (values) => {
      const fieldsCollectionRef = collection(db, "farms", farmId, "fields");
      await addDoc(fieldsCollectionRef, values);
      fetchFields();
      form.resetFields();
    };

  return (
    <div>
      <h2>Fields for Farm {farmId}</h2>
      <Button type="primary" onClick={showAddFieldModal} style={{ marginBottom: 16 }}>
      Add Field
    </Button>
   
    <Row gutter={[16, 16]} className="fields-grid">
  {fields.map((field) => (
    <Col span={60} key={field.id}>
      <Card title={field.name} bordered={false} className="field-card">
        <p><strong>Address:</strong> {field.address}</p>
        <p><strong>Acres:</strong> {field.acres}</p>
        <p><strong>Soil Type:</strong> {field.soilType}</p>
        <p><strong>Notes:</strong> {field.notes}</p>
        <p><strong>Boundary:</strong> {field.boundary}</p>
      </Card>
    </Col>
  ))}
</Row>

      <Modal
      title="Add New Field"
      visible={isAddFieldModalVisible}
      onCancel={handleAddFieldCancel}
      footer={null}
    >
    <Form form={form} layout="vertical" onFinish={addField}>
  <Form.Item
    name="name"
    label="Field Name"
    rules={[{ required: true, message: 'Please enter the field name' }]}
  >
    <Input placeholder="Enter field name" />
  </Form.Item>

  <Form.Item
    name="address"
    label="Address"
  >
    <Input placeholder="Enter address" />
  </Form.Item>

  <Form.Item
    name="acres"
    label="Acres"
    rules={[{ required: true, message: 'Please enter the size in acres' }]}
  >
    <InputNumber min={1} style={{ width: '100%' }} placeholder="Enter size in acres" />
  </Form.Item>

  <Form.Item
    name="soilType"
    label="Soil Type"
    rules={[{ required: true, message: 'Please select the soil type' }]}
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

  <Form.Item
    name="notes"
    label="Additional Notes"
  >
    <TextArea rows={4} placeholder="Enter any additional notes" />
  </Form.Item>

  <Form.Item
    name="boundary"
    label="Field Boundary"
    help="Provide a link to the map or a description"
  >
    <Input placeholder="Link to map or description" />
  </Form.Item>

  <Form.Item>
    <Button type="primary" htmlType="submit">Submit</Button>
    <Button type="default" onClick={handleAddFieldCancel} style={{ marginLeft: '10px' }}>
      Cancel
    </Button>
  </Form.Item>
</Form>

    </Modal>
    </div>
  );
};

export default FieldsView;
