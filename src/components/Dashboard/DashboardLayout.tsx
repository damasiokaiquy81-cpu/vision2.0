import React from 'react';
import { Header } from './Header';
import { FilterSidebar } from './FilterSidebar';
import { ChatMain } from './ChatMain';
import { InsightsSidebar } from './InsightsSidebar';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="h-screen overflow-hidden" style={{ background: 'var(--gradient-bg)' }}>
      <div className="dashboard-grid">
        <Header />
        <FilterSidebar />
        <div className="relative flex flex-col overflow-hidden">
          <ChatMain />
        </div>
        <InsightsSidebar />
      </div>
    </div>
  );
};