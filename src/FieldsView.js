import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase-config";
import { doc, getDoc, collection, getDocs, addDoc } from "firebase/firestore";
import { Form, Input, Button, Select, InputNumber, Card, Row, Col } from "antd";
import "./FieldsView.css"; // Make sure your CSS file is imported
import Header from "./Header";
import AddFieldModal from "./AddFieldModal";
import FieldCard from "./FieldCard";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
const { Option } = Select;

const FieldsView = () => {
  const navigate = useNavigate();
  const { farmId } = useParams();
  const [fields, setFields] = useState([]);
  const [form] = Form.useForm();
  const [farmName, setFarmName] = useState("");
  const [isAddFieldModalVisible, setIsAddFieldModalVisible] = useState(false);

  const fetchFields = async () => {
    const fieldsCollectionRef = collection(db, "farms", farmId, "fields");
    const data = await getDocs(fieldsCollectionRef);
    setFields(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  // Function to fetch the farm's details
  const fetchFarmDetails = async () => {
    const farmRef = doc(db, "farms", farmId);
    const farmSnap = await getDoc(farmRef);
    if (farmSnap.exists()) {
      setFarmName(farmSnap.data().name); // Assuming the farm document has a 'name' field
    } else {
      console.log("No such farm!");
    }
  };
  useEffect(() => {
    fetchFarmDetails();
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

      <div className="fields-header">
        <ArrowLeftOutlined
          onClick={() => navigate("/dashboard")}
          style={{ marginRight: 16, cursor: "pointer" }}
        />
        <span style={{ flex: 1 }}>
          <h2>{farmName}</h2>
        </span>
        <Button
          className="add-field-btn"
          onClick={() => setIsAddFieldModalVisible(true)}
        >
          Add Field
        </Button>
      </div>

      <div className="fields-container">
        {" "}
        {/* Container for padding and possibly other styles */}
        <div className="fields-grid">
          {" "}
          {/* Grid container */}
          {fields.map((field) => (
            <FieldCard key={field.id} field={field} />
          ))}
        </div>
      </div>

      <AddFieldModal
        isVisible={isAddFieldModalVisible}
        onSubmit={addField}
        onCancel={() => setIsAddFieldModalVisible(false)}
      />
    </div>
  );
};

export default FieldsView;
