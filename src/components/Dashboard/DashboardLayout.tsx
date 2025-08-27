import React from 'react';
import { Header } from './Header';
import { ChatArea } from './ChatArea';
import { ReportsArea } from './ReportsArea';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <ChatArea />
        <ReportsArea />
      </div>
    </div>
  );
};