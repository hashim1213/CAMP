import React from 'react';
import { Form, Input, Button, Select, InputNumber, Modal } from 'antd';
const { TextArea } = Input;
const { Option } = Select;

const AddFieldModal = ({ isVisible, onSubmit, onCancel }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    await onSubmit(values); // Call the onSubmit prop passed from parent
    form.resetFields(); // Reset form fields after submission
  };
  return (
    <Modal
    title="Add New Field"
    visible={isVisible} 
    onCancel={onCancel}
    footer={null}
  >
     <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
          <Button type="default" onClick={onCancel} style={{ marginLeft: '10px' }}> 
            Cancel
          </Button>
        </Form.Item>

</Form>

  </Modal>
  );
};

export default AddFieldModal;
