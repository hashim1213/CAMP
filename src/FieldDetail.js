import React from 'react';
import { useParams } from 'react-router-dom';
import { Tabs } from 'antd';
import Header from './Header'; // Import the Header component
import CropView from './CropView';
import InspectionsView from './InspectionsView'; 
const { TabPane } = Tabs;
// Adjust the path as needed

const FieldDetail = () => {
  const { fieldId } = useParams(); // To fetch data for the specific field

  return (
    
    <div>
        <Header/>
      <h2>Field Details (ID: {fieldId})</h2>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Crops" key="1">
          <CropView />
        </TabPane>
        <TabPane tab="Inspections" key="2">
          <InspectionsView />
        </TabPane>

        <TabPane tab="Programmes" key="3">
          {/* Content for Programmes */}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default FieldDetail;
