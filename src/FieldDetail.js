import React from 'react';
import { useParams } from 'react-router-dom';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const FieldDetail = () => {
  const { fieldId } = useParams(); // To fetch data for the specific field

  return (
    <div>
      <h2>Field Details (ID: {fieldId})</h2>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Crops" key="1">
          {/* Content for Crops */}
        </TabPane>
        <TabPane tab="Inspections" key="2">
          {/* Content for Inspections */}
        </TabPane>
        <TabPane tab="Programmes" key="3">
          {/* Content for Programmes */}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default FieldDetail;
