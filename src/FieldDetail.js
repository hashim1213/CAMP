import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "./firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { Tabs, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Header from "./Header";
import CropView from "./CropView";
import InspectionsView from "./InspectionsView";
import "./FieldDetail.css";

const { TabPane } = Tabs;

const FieldDetail = () => {
  const navigate = useNavigate();
  const { farmId, fieldId } = useParams(); // Ensure farmId is also retrieved from useParams
  const [fieldDetails, setFieldDetails] = useState({ name: "Loading..." }); // Initialized with a loading state

  useEffect(() => {
    const fetchFieldDetails = async () => {
      console.log(`Fetching details for farmId: ${farmId}, fieldId: ${fieldId}`);
      if (!farmId || !fieldId) {
        console.log("farmId or fieldId is missing.");
        return;
      }
      const fieldRef = doc(db, "farms", farmId, "fields", fieldId);
      try {
        const docSnap = await getDoc(fieldRef);
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setFieldDetails(docSnap.data());
        } else {
          console.log("No such field!");
          setFieldDetails({ name: "Field not found" }); // Provide feedback when field is not found
        }
      } catch (error) {
        console.error("Error fetching field details:", error);
        setFieldDetails({ name: "Error fetching details" }); // Provide feedback on error
      }
    };
  
    fetchFieldDetails();
  }, [farmId, fieldId]);
  

  return (
    <div>
      <Header />
      <div className="fields-header">
        <ArrowLeftOutlined
          onClick={() => navigate(-1)}
          style={{ marginRight: 16, cursor: "pointer" }}
        />
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
        <TabPane tab="Programmes" key="3">
          {/* Placeholder for Programmes content */}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default FieldDetail;
