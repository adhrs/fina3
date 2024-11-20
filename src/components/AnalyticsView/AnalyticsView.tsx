import React from 'react';
import { BarChart } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="p-8 bg-white rounded-lg shadow text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <BarChart className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-semibold text-gray-900">Analytics</h2>
      </div>
      <p className="text-gray-500">
        This section is under development.
      </p>
    </div>
  );
}; 