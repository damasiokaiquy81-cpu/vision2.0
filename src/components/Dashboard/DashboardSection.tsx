import React from 'react';
import { Construction, BarChart3 } from 'lucide-react';

const DashboardSection: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-100">
            <BarChart3 className="w-6 h-6 text-gray-600" />
          </div>
          Dashboard
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-flex p-4 rounded-full bg-gray-100 mb-4">
              <Construction className="w-12 h-12 text-gray-600" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Em desenvolvimento
          </h2>
          
          <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
            Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;