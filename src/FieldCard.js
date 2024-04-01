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
    <div className="field-card" onClick={handleClick}>
    <div className = "field-title">
    <h3> {field.name}</h3>
    <h2>{field.acres} ac</h2>
    </div>
    <div className="field-info">
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
   </div>
    </div>
  );
};

export default FieldCard;
