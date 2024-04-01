import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload, message, Modal, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
const { Option } = Select;

const InspectionsView = () => {
    const { fieldId } = useParams();
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [inspections, setInspections] = useState([]);
    const [fileList, setFileList] = useState([]);

  const showModal = () => {
    setIsModalVisible(true);
    form.resetFields(); // Reset form fields when opening the modal
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  // Handler for file list change
  const onUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Handler for form submission
  const onFinish = (values) => {
    console.log(values);
    // Here, you'd integrate with your backend or Firestore
    setInspections([...inspections, values]);
    setIsModalVisible(false);
    message.success('Inspection details added successfully!');
    form.resetFields(); // Optionally reset form fields after submission
  };
  // Capture the current geolocation
  const captureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setFieldsValue({
            location: `Lat: ${position.coords.latitude}, Long: ${position.coords.longitude}`
          });
          message.success('Geolocation captured successfully.');
        },
        () => {
          message.error('Error capturing geolocation.');
        }
      );
    } else {
      message.error('Geolocation is not supported by this browser.');
    }
  };

  return (
    <>
    <Button type="primary" onClick={showModal}>
      Add Inspection
    </Button>
    <Modal title="Add Inspection Details" visible={isModalVisible} onCancel={handleCancel} footer={null} onOk={form.submit}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="plantStage"
        label="Plant Stage"
        rules={[{ required: true, message: 'Please select the plant stage!' }]}
      >
        <Select placeholder="Select a stage">
          <Option value="germination">Germination</Option>
          <Option value="vegetative">Vegetative</Option>
          <Option value="flowering">Flowering</Option>
          <Option value="harvest">Harvest</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="notes"
        label="Observation Notes"
      >
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

      <Form.Item
        name="location"
        label="Location"
      >
        <Input readOnly />
      </Form.Item>

      <Button type="primary" onClick={captureLocation} style={{ marginBottom: '10px' }}>
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
        <Card key={index} title={`Inspection on ${inspection.plantStage}`} style={{ marginTop: 16 }}>
          <p>Notes: {inspection.notes}</p>
          <p>Location: {inspection.location}</p>
          {/* Display uploaded pictures if necessary */}
        </Card>
      ))}
    </>
  );
};

export default InspectionsView;
 