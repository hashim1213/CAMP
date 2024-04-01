import React from 'react';
import { Card } from 'antd';
import {
  EnvironmentOutlined,
  FileTextOutlined,
  AreaChartOutlined,
} from '@ant-design/icons';
import './FieldCard.css'; // Ensure you create and import your CSS for styling
import { useNavigate } from 'react-router-dom';

const FieldCard = ({ field }) => {
  const navigate = useNavigate();

const handleClick = () => {
  navigate(`/fields/${field.id}`); // Navigate to FieldDetail view
};
  return (
    <Card title={field.name} bordered={false} className="field-card" onClick={handleClick}>
      <p>
        <EnvironmentOutlined /> Address: {field.address}
      </p>
      <p>
        <AreaChartOutlined /> Acres: {field.acres}
      </p>
      <p>
        <FileTextOutlined /> Soil Type: {field.soilType}
      </p>
      {field.notes && (
        <p>
          <FileTextOutlined /> Notes: {field.notes}
        </p>
      )}
      {field.boundary && (
        <p>
          <FileTextOutlined /> Boundary: {field.boundary}
        </p>
      )}
    </Card>
  );
};

export default FieldCard;
