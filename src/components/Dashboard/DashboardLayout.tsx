import React, { useState } from 'react';
import { Header } from './Header';
import { ChatArea } from './ChatArea';
import { FilterArea } from './FilterArea';

export const DashboardLayout: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const handleFilterFormChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };



  const handleFilterCancel = () => {
    setSelectedFilter(null);
    setFormData({});
  };

  const canSendFilterMessage = () => {
    if (!selectedFilter) return false;
    if (!selectedFilter.requiresData) return true;
    
    const requiredFields = selectedFilter.dataFields?.filter((field: any) => field.required) || [];
    return requiredFields.every((field: any) => formData[field.key]?.trim());
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <ChatArea 
          selectedFilter={selectedFilter}
          formData={formData}
          isFilterLoading={isFilterLoading}
          onFilterFormChange={handleFilterFormChange}
          onFilterSendMessage={() => {}}
          onFilterCancel={handleFilterCancel}
          canSendFilterMessage={canSendFilterMessage}
        />
        <FilterArea 
          onFilterSelect={setSelectedFilter}
          onLoadingChange={setIsFilterLoading}
          selectedFilter={selectedFilter}
          formData={formData}
          onFormChange={handleFilterFormChange}
        />
      </div>
    </div>
  );
};