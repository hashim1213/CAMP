import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, PhoneOutlined, EnvironmentOutlined, FieldNumberOutlined } from '@ant-design/icons';
import './FarmCard.css'; // Make sure to import your CSS
import { ShareAltOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

const FarmCard = ({ farm, teamMembers = [], numberOfFields, totalAcres }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/farms/${farm.id}/fields`); // Corrected path to include 'fields' not 'field'
  };

  // Resolve team member names from sharedWith IDs
  const sharedWithContent = (
    <div>
      {farm.sharedWith?.map(sharedId => {
        const member = teamMembers.find(member => member.id === sharedId);
        return <div key={sharedId}>{member?.name || 'Unknown'}</div>; // Ensure you have a fallback
      })}
    </div>
  );
  
  return (
    <div className="farm-card" onClick={handleClick}>
      <h3> {farm.name}</h3>
      <p><EnvironmentOutlined /> {farm.address}</p>
      <div className="contact-info">
        <p><UserOutlined /> Contact: {farm.contactName}</p>
        <p><PhoneOutlined /> Phone: {farm.phoneNumber}</p>
        <p><FieldNumberOutlined /> Fields: {numberOfFields} (Total acres: {totalAcres})</p>
      </div>
      {farm.sharedWith && farm.sharedWith.length > 0 && (
        <Tooltip title={sharedWithContent} placement="top">
          <ShareAltOutlined style={{ fontSize: '20px' }} />
        </Tooltip>
      )}

    </div>
  );
};

export default FarmCard;
