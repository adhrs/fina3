import React from 'react';
import { ContactCategory } from '../../types/ContactTypes';

interface ContactTabsProps {
  activeCategory: ContactCategory | 'all';
  onCategoryChange: (category: ContactCategory | 'all') => void;
  counts: Record<ContactCategory | 'all', number>;
}

export const ContactTabs: React.FC<ContactTabsProps> = ({
  activeCategory,
  onCategoryChange,
  counts,
}) => {
  const categories: Array<{ id: ContactCategory | 'all'; label: string }> = [
    { id: 'all', label: 'All Contacts' },
    { id: 'family', label: 'Family' },
    { id: 'business', label: 'Business' },
    { id: 'asset', label: 'Asset Related' },
    { id: 'professional', label: 'Professional' },
    { id: 'personal', label: 'Personal' },
    { id: 'other', label: 'Other' },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Contact categories">
        {categories.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onCategoryChange(id)}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeCategory === id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {label}
            <span className="ml-2 text-gray-400">({counts[id]})</span>
          </button>
        ))}
      </nav>
    </div>
  );
};