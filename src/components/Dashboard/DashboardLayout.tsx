import React, { useState } from 'react';
import { Header } from './Header';
import { ChatArea } from './ChatArea';
import { FilterArea } from './FilterArea';
import RightSidebar, { SectionType } from './RightSidebar';
import CRMSection from './CRMSection';


export const DashboardLayout: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState<SectionType>('chat');

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

  const renderMainContent = () => {
    switch (currentSection) {
      case 'chat':
        return (
          <div className="h-full flex overflow-hidden">
            <div className="flex-1 min-w-0">
              <ChatArea 
                selectedFilter={selectedFilter}
                formData={formData}
                isFilterLoading={isFilterLoading}
                onFilterFormChange={handleFilterFormChange}
                onFilterSendMessage={() => {}}
                onFilterCancel={handleFilterCancel}
                canSendFilterMessage={canSendFilterMessage}
              />
            </div>
            <FilterArea 
              onFilterSelect={setSelectedFilter}
              onLoadingChange={setIsFilterLoading}
              selectedFilter={selectedFilter}
              formData={formData}
              onFormChange={handleFilterFormChange}
            />
          </div>
        );
      case 'crm':
        return <CRMSection />;
      default:
        return <CRMSection />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <div className="flex-1 flex overflow-hidden relative">
         <RightSidebar 
           onSectionChange={setCurrentSection}
           currentSection={currentSection}
         />
         <div className="flex-1 transition-all duration-300 ml-16 md:ml-64">
           {renderMainContent()}
         </div>
       </div>
    </div>
  );
};