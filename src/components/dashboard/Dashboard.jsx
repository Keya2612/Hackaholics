'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Overview from './Overview';
import Aptitude from './Aptitude';
import GroupDiscussion from './GroupDiscussion';
import Interview from './Interview';
import Analytics from './Analytics';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview />;
      case 'aptitude':
        return <Aptitude />;
      case 'groupDiscussion':
        return <GroupDiscussion />;
      case 'interview':
        return <Interview />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1">{renderSection()}</main>
    </div>
  );
};

export default Dashboard;