import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase-config';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Form, Input, Button, Select, InputNumber, Card, Row, Col } from 'antd';
import './FieldsView.css'; // Make sure your CSS file is imported
import { Modal } from 'antd';
import Header from './Header'; 
import AddFieldModal from './AddFieldModal';

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
        // Ensure no field is undefined; set default values for optional fields
        const fieldData = {
          name: values.name,
          address: values.address || "", // Default to empty string if undefined
          acres: values.acres,
          soilType: values.soilType,
          notes: values.notes || "", // Default to empty string if undefined
          boundary: values.boundary || "", // Default to empty string if undefined
        };
      
        const fieldsCollectionRef = collection(db, "farms", farmId, "fields");
        try {
          await addDoc(fieldsCollectionRef, fieldData);
          fetchFields(); // Refresh your fields list
          setIsAddFieldModalVisible(false); // Close the modal after successful submission
        } catch (error) {
          console.error("Error adding document: ", error);
        }
      };
      
  return (
    <div>
        <Header />
      <h2>Fields for Farm {farmId}</h2>
      <Button type="primary" onClick={() => setIsAddFieldModalVisible(true)} style={{ marginBottom: 16 }}>
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
<AddFieldModal
        isVisible={isAddFieldModalVisible}
        onSubmit={addField}
        onCancel={() => setIsAddFieldModalVisible(false)}
      />
 
    </div>
  );
};

export default FieldsView;
