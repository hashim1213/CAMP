import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

const { Option } = Select;

const InspectionsView = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [showWeedPressure, setShowWeedPressure] = useState(false);
  const [showPestPressure, setShowPestPressure] = useState(false);
  const { fieldId } = useParams();

  const onUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setShowWeedPressure(false);
    setShowPestPressure(false);
  };

  const fetchInspections = async () => {
    const q = query(collection(db, "fields", fieldId, "inspections"));
    const querySnapshot = await getDocs(q);
    const fetchedInspections = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate().toISOString().substring(0, 10),
        createdAt: data.createdAt?.toDate().toISOString().substring(0, 10),
      };
    });
    setInspections(fetchedInspections);
  };

  useEffect(() => {
    fetchInspections();
  }, [fieldId]);

  const onFinish = async (values) => {
    console.log("Form values:", values);
    const { upload, ...dataToSave } = values;
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
      fetchInspections();
      setIsModalVisible(false);
      form.resetFields();
      message.success("Inspection details added successfully!");
    } catch (error) {
      console.error("Error adding inspection: ", error);
      message.error("Failed to add inspection details.");
    }
  };

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

  const handleObservationTypeChange = (value) => {
    setShowWeedPressure(value.includes("weeds"));
    setShowPestPressure(value.includes("pests"));
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

          <Form.Item
            name="observationType"
            label="Observation Type"
            rules={[
              { required: true, message: "Please select the observation type!" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select observation types"
              onChange={handleObservationTypeChange}
            >
              <Option value="weeds">Weeds</Option>
              <Option value="pests">Pests</Option>
              <Option value="disease">Disease</Option>
            </Select>
          </Form.Item>

          {showWeedPressure && (
            <Form.Item
              name="weedPressure"
              label="Weed Pressure"
              rules={[
                { required: true, message: "Please select weed pressure!" },
              ]}
            >
              <Select placeholder="Select weed pressure">
                <Option value="low">Low</Option>
                <Option value="medium">Medium</Option>
                <Option value="high">High</Option>
              </Select>
            </Form.Item>
          )}

          {showPestPressure && (
            <Form.Item
              name="pestPressure"
              label="Pest Pressure"
              rules={[
                { required: true, message: "Please select pest pressure!" },
              ]}
            >
              <Select placeholder="Select pest pressure">
                <Option value="low">Low</Option>
                <Option value="medium">Medium</Option>
                <Option value="high">High</Option>
              </Select>
            </Form.Item>
          )}

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
      {inspections.map((inspection) => (
        <Card
          key={inspection.id}
          title={`Inspection on ${inspection.plantStage}`}
          style={{ marginTop: 16 }}
        >
          <p>Observation Type: {inspection.observationType?.join(", ")}</p>
          {inspection.weedPressure && <p>Weed Pressure: {inspection.weedPressure}</p>}
          {inspection.pestPressure && <p>Pest Pressure: {inspection.pestPressure}</p>}
          <p>Notes: {inspection.notes}</p>
          <p>Date: {inspection.createdAt}</p>
          <p>Location: {inspection.location}</p>
        </Card>
      ))}
    </>
  );
};

export default InspectionsView;
