import React, { useState } from 'react';
import { CircleDot } from 'lucide-react';

interface MarriageData {
  id: string;
  date?: string;
  status: 'current' | 'divorced' | 'deceased';
  createdAt: string;
  updatedAt: string;
}

interface MarriageConnectorProps {
  marriageData?: MarriageData;
  onClick?: () => void;
}

export const MarriageConnector: React.FC<MarriageConnectorProps> = ({
  marriageData,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="flex items-center justify-center w-12 cursor-pointer relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      title={marriageData?.date ? `Marriage Date: ${new Date(marriageData.date).toLocaleDateString()}` : 'Marriage'}
      data-marriage-id={marriageData?.id}
    >
      <div className="relative">
        <CircleDot 
          className={`w-5 h-5 transform -translate-x-1 ${
            isHovered 
              ? 'text-blue-600 stroke-2' 
              : marriageData?.status === 'current' 
                ? 'text-gray-400'
                : 'text-red-400'
          }`}
        />
        <CircleDot 
          className={`w-5 h-5 transform translate-x-1 absolute top-0 left-0 ${
            isHovered 
              ? 'text-blue-600 stroke-2' 
              : marriageData?.status === 'current' 
                ? 'text-gray-400'
                : 'text-red-400'
          }`}
        />
      </div>
    </div>
  );
};