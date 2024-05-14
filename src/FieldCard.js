import React from 'react';
import { Card } from 'antd';
import { EnvironmentOutlined, FileTextOutlined, AreaChartOutlined } from '@ant-design/icons';
import './FieldCard.css'; // Ensure your CSS for styling is correctly set up
import { useNavigate } from 'react-router-dom';
import BoundaryThumbnail from './BoundaryThumbnail'; // Import the new BoundaryThumbnail component

const FieldCard = ({ field }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/fields/${field.id}`); // Navigate to the FieldDetail view
  };

  // A simple utility function to check if the boundary data exists and is valid
  const hasValidBoundary = (boundary) => {
    try {
      const boundaryData = JSON.parse(boundary);
      return boundaryData && boundaryData.type === "Feature" && boundaryData.geometry.type === "Polygon";
    } catch (error) {
      console.error("Error parsing boundary data:", error);
      return false;
    }
  };

  return (
    <div className="field-card" onClick={handleClick}>
      <div className="field-title">
        <h3>{field.name}</h3>
        <h2>{field.acres} ac</h2>
      </div>
      <div className="field-info">
        <p>
          <EnvironmentOutlined /> {field.address}
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
        {field.boundary && hasValidBoundary(field.boundary) && (
          <div>
            <EnvironmentOutlined /> Field Boundary:
            <BoundaryThumbnail boundary={field.boundary} /> {/* Render the boundary thumbnail */}
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldCard;
