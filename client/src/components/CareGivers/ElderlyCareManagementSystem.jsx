import React, { useState } from 'react';
import { Tabs } from 'antd';
import CaregiverManagement from './CaregiverManagement';
import CaregiverSchedule from './CaregiverSchedule';

const { TabPane } = Tabs;

const ElderlyCareManagementSystem = () => {
  const [caregivers, setCaregivers] = useState([]);
  const [elders] = useState([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    // Add more elders as needed
  ]);

  return (
    <Tabs defaultActiveKey="1" className="mt-16">
      <TabPane tab="Caregiver Management" key="1">
        <CaregiverManagement
          caregivers={caregivers}
          setCaregivers={setCaregivers}
        />
      </TabPane>
      <TabPane tab="Caregiver Schedule" key="2">
        <CaregiverSchedule caregivers={caregivers} elders={elders} />
      </TabPane>
    </Tabs>
  );
};

export default ElderlyCareManagementSystem;
