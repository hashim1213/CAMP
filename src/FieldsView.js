import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "./firebase-config";
import { doc, getDoc, collection, getDocs, addDoc } from "firebase/firestore";
import { Form, Input, Button, Card } from "antd";
import "./FieldsView.css"; 
import Header from "./Header";
import AddFieldModal from "./AddFieldModal";
import FieldCard from "./FieldCard";
import { ArrowLeftOutlined } from "@ant-design/icons";

const FieldsView = () => {
  const navigate = useNavigate();
  const { farmId } = useParams();
  const [fields, setFields] = useState([]);
  const [farmName, setFarmName] = useState("");
  const [isAddFieldModalVisible, setIsAddFieldModalVisible] = useState(false);

  const fetchFields = async () => {
    const fieldsCollectionRef = collection(db, "farms", farmId, "fields");
    const data = await getDocs(fieldsCollectionRef);
    setFields(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const fetchFarmDetails = async () => {
    const farmRef = doc(db, "farms", farmId);
    const farmSnap = await getDoc(farmRef);
    if (farmSnap.exists()) {
      setFarmName(farmSnap.data().name);
    } else {
      console.log("No such farm!");
    }
  };

  useEffect(() => {
    fetchFarmDetails();
    fetchFields();
  }, [farmId]);

  const addField = async (values) => {
    const fieldData = {
      name: values.name,
      address: values.address || "",
      acres: values.acres,
      soilType: values.soilType,
      notes: values.notes || "",
      boundary: values.boundary || "",
    };

    const fieldsCollectionRef = collection(db, "farms", farmId, "fields");
    try {
      await addDoc(fieldsCollectionRef, fieldData);
      fetchFields();
      setIsAddFieldModalVisible(false);
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
        <Button style={{ marginRight: 16 }} onClick={() => navigate(`/farm-info/${farmId}`)}>
          Edit Farm Info
        </Button>
        <Button className="add-field-btn" onClick={() => setIsAddFieldModalVisible(true)}>
          Add Field
        </Button>
      </div>

      <div className="fields-container">
        <div className="fields-grid">
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
