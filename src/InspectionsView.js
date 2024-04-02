import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Modal,
  message,
  Card,
  DatePicker,
  Select,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { db } from "./firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  serverTimestamp,
} from "firebase/firestore"; // Ensure serverTimestamp is imported
import "./FieldDetail.css";

const { Option } = Select; // Correctly define Option

const InspectionsView = () => {
  // Your component's state and functions...
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [inspections, setInspections] = useState([]);
  const { fieldId } = useParams();

  const onUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const fetchInspections = async () => {
    const q = query(collection(db, "fields", fieldId, "inspections"));
    const querySnapshot = await getDocs(q);
    const fetchedInspections = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate().toISOString().substring(0, 10), // Existing date field
        createdAt: data.createdAt?.toDate().toISOString().substring(0, 10), // Handle createdAt similarly
      };
    });

    setInspections(fetchedInspections);
  };

  useEffect(() => {
    fetchInspections();
  }, [fieldId]); // Re-fetch inspections if fieldId changes

  const onFinish = async (values) => {
    console.log("Form values:", values);

    // Exclude fields that shouldn't be directly saved to Firestore
    const { upload, ...dataToSave } = values;

    // Format values as needed and add a server timestamp
    const formattedValues = {
      ...dataToSave,

      createdAt: serverTimestamp(),

      location: values.location || "Not specified",
    };

    try {
      const inspectionsCollectionRef = collection(
        db,
        "fields",
        fieldId,
        "inspections"
      );
      await addDoc(inspectionsCollectionRef, formattedValues);

      // Update UI and state
      setInspections((prevInspections) => [
        ...prevInspections,
        { ...formattedValues, id: Date.now().toString() },
      ]); // Using Date.now() as a placeholder for the unique ID
      setIsModalVisible(false);
      form.resetFields();
      message.success("Inspection details added successfully!");
    } catch (error) {
      console.error("Error adding inspection: ", error);
      message.error("Failed to add inspection details.");
    }
  };

  // Capture the current geolocation
  const captureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setFieldsValue({
            location: `Lat: ${position.coords.latitude}, Long: ${position.coords.longitude}`,
          });
          message.success("Geolocation captured successfully.");
        },
        () => {
          message.error("Error capturing geolocation.");
        }
      );
    } else {
      message.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <>
      <div className="add-crop-container">
        <Button onClick={showModal} className="add-crop-btn">
          Add Inspection
        </Button>
      </div>
      <Modal
        title="Add Inspection Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        onOk={form.submit}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="plantStage"
            label="Plant Stage"
            rules={[
              { required: true, message: "Please select the plant stage!" },
            ]}
          >
            <Select placeholder="Select a stage">
              <Option value="germination">Germination</Option>
              <Option value="vegetative">Vegetative</Option>
              <Option value="flowering">Flowering</Option>
              <Option value="harvest">Harvest</Option>
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="Observation Notes">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="upload"
            label="Upload Pictures"
            valuePropName="fileList"
            getValueFromEvent={onUploadChange}
          >
            <Upload
              name="files"
              listType="picture"
              beforeUpload={() => false}
              onChange={onUploadChange}
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="location" label="Location">
            <Input readOnly />
          </Form.Item>

          <Button
            type="primary"
            onClick={captureLocation}
            style={{ marginBottom: "10px" }}
          >
            Capture Location
          </Button>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Inspection
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {inspections.map((inspection, index) => (
        <Card
          key={index}
          title={`Inspection on ${inspection.plantStage}`}
          style={{ marginTop: 16 }}
        >
          <p>Notes: {inspection.notes}</p>
          <p>Date: {inspection.createdAt}</p>{" "}
          {/* Convert Firestore Timestamp to readable date string */}
          <p>Location: {inspection.location}</p>
          {/* Display uploaded pictures if necessary */}
        </Card>
      ))}
    </>
  );
};

export default InspectionsView;
