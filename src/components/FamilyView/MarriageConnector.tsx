import React, { useState } from 'react';
import { CircleDot } from 'lucide-react';

interface MarriageConnectorProps {
  marriageDate?: string;
  onClick?: () => void;
}

export const MarriageConnector: React.FC<MarriageConnectorProps> = ({
  marriageDate,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="flex items-center justify-center w-12 cursor-pointer relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      title={marriageDate ? `Marriage Date: ${new Date(marriageDate).toLocaleDateString()}` : 'Marriage'}
    >
      <div className="relative">
        <CircleDot 
          className={`w-5 h-5 transform -translate-x-1 ${
            isHovered 
              ? 'text-blue-600 stroke-2' 
              : 'text-gray-400'
          }`}
        />
        <CircleDot 
          className={`w-5 h-5 transform translate-x-1 absolute top-0 left-0 ${
            isHovered 
              ? 'text-blue-600 stroke-2' 
              : 'text-gray-400'
          }`}
        />
      </div>
    </div>
  );
};