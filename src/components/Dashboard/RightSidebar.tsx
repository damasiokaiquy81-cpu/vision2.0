import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';

type SectionType = 'chat' | 'crm';

interface RightSidebarProps {
  onSectionChange: (section: SectionType) => void;
  currentSection: SectionType;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ onSectionChange, currentSection }) => {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sections = [
    {
      id: 'chat' as SectionType,
      name: 'Chat IA',
      icon: MessageSquare,
      color: 'from-teal-400 to-teal-600'
    },
    {
      id: 'crm' as SectionType,
      name: 'CRM Vision',
      icon: Users,
      color: 'from-blue-400 to-blue-600'
    }
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg transition-all duration-300 z-40 ${
      isCollapsed ? 'w-16' : 'w-64'
    } md:w-64`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:shadow-lg transition-shadow z-50 md:hidden"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        )}
      </button>

      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className={`font-semibold text-gray-800 transition-opacity ${
          isCollapsed ? 'opacity-0 md:opacity-100' : 'opacity-100'
        }`}>
          Funcionalidades
        </h2>
      </div>

      {/* Navigation */}
      <div className="p-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = currentSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 mb-2 ${
                isActive
                  ? 'bg-gray-100 text-gray-800 border-l-4 border-teal-500'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                isActive
                  ? 'bg-teal-100'
                  : 'bg-gray-100'
              }`}>
                <Icon className={`w-4 h-4 ${
                  isActive ? 'text-teal-600' : 'text-gray-600'
                }`} />
              </div>
              <span className={`font-medium transition-opacity ${
                isCollapsed ? 'opacity-0 md:opacity-100' : 'opacity-100'
              }`}>
                {section.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RightSidebar;
export type { SectionType };