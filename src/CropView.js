import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Modal,
  message,
  Card,
  Row,
  Col,
} from "antd";
import { db } from "./firebase-config";
import { collection, addDoc, getDocs, query } from "firebase/firestore";
import "./FieldDetail.css"; // Ensure you have a CSS file for CropView for styling
import { PiPlantDuotone } from "react-icons/pi";

const CropView = () => {
  const navigate = useNavigate();
  const { fieldId } = useParams();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [crops, setCrops] = useState([]);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const fetchCrops = async () => {
    const q = query(collection(db, "fields", fieldId, "crops"));
    const querySnapshot = await getDocs(q);
    const fetchedCrops = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      // Check if plantingDate exists and is a Timestamp before converting
      let plantingDate;
      if (data.plantingDate && typeof data.plantingDate.toDate === "function") {
        plantingDate = data.plantingDate
          .toDate()
          .toISOString()
          .substring(0, 10);
      } else if (typeof data.plantingDate === "string") {
        // If stored as a string
        plantingDate = data.plantingDate;
      } else {
        plantingDate = "Unknown"; // Or handle as appropriate
      }
      return {
        id: doc.id,
        ...data,
        plantingDate,
      };
    });
    setCrops(fetchedCrops);
  };

  useEffect(() => {
    fetchCrops();
  }, [fieldId]); // Re-fetch crops if fieldId changes

  const onFinish = async (values) => {
    console.log("Form values:", values);

    try {
      const cropsCollectionRef = collection(db, "fields", fieldId, "crops");

      const formattedValues = {
        ...values,
        plantingDate: values.plantingDate
          ? values.plantingDate.format("YYYY-MM-DD")
          : null,
      };
      await addDoc(cropsCollectionRef, formattedValues);
      setCrops([...crops, formattedValues]);
      setIsModalVisible(false); // Close the modal after submission
      form.resetFields(); // Reset form fields after submission
      message.success("Crop details added successfully!");
    } catch (error) {
      console.error("Error adding crop: ", error);
      message.error("Failed to add crop details!");
    }
  };

  return (
    <div>
      <div className="add-crop-container">
        <Button onClick={showModal} className="add-crop-btn">
          Add Crop
        </Button>
      </div>

      <Modal
        title="Add Crop Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="cropName"
            label="Crop Name"
            rules={[{ required: true, message: "Please input the crop name!" }]}
          >
            <Input placeholder="E.g., Wheat" />
          </Form.Item>

          <Form.Item
            name="plantingDate"
            label="Planting Date"
            rules={[
              { required: true, message: "Please select the planting date!" },
            ]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item name="fertilizer" label="Fertilizer Used">
            <Input placeholder="E.g., Nitrogen-based" />
          </Form.Item>

          <Form.Item name="cropProtection" label="Crop Protection Details">
            <Input.TextArea
              rows={4}
              placeholder="Details about crop protection measures"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Crop Details
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <div className="crops-container">
        {crops.map((crop, index) => (
          <Card key={crop.id}>
            <div className="field-title">
              <h2>{crop.cropName}</h2>
              <div className="custom-icon">
                <PiPlantDuotone />
              </div>
            </div>
            {/* Icon with a little margin */}
            <p>Planting Date: {crop.plantingDate}</p>
            <p>Fertilizer Used: {crop.fertilizer}</p>
            <p>Crop Protection Details: {crop.cropProtection}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CropView;
