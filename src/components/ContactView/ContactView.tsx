import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { ContactTabs } from './ContactTabs';
import { ContactList } from './ContactList';
import { ContactForm } from './ContactForm';
import { Contact, ContactCategory, ContactFilter } from '../../types/ContactTypes';
import { useAuth } from '../../contexts/AuthContext';

export const ContactView: React.FC = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeCategory, setActiveCategory] = useState<ContactCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [filter, setFilter] = useState<ContactFilter>({});

  // Load initial contacts from admin data
  useEffect(() => {
    if (user?.adminData) {
      const allContacts: Contact[] = [];

      // Add admin contact if it exists in adminData
      if (user.adminData.contacts) {
        allContacts.push(...user.adminData.contacts);
      }

      // Create contacts from family members
      if (user.adminData.familyBox) {
        const familyContacts = user.adminData.familyBox
          .filter(member => member.relationship !== 'Admin') // Skip admin as we already have their contact
          .map(member => ({
            id: `family-${member.id}`,
            name: `${member.firstName} ${member.lastName}`,
            categories: ['family'] as ContactCategory[],
            relations: [{
              type: 'family',
              id: member.id,
              name: `${member.firstName} ${member.lastName}`
            }],
            createdAt: member.createdAt,
            updatedAt: member.updatedAt,
            createdBy: user.id,
            updatedBy: user.id
          }));
        allContacts.push(...familyContacts);
      }

      // Create contacts from companies
      if (user.adminData.assetBox) {
        const companyContacts = user.adminData.assetBox
          .filter(asset => asset.type === 'company')
          .map(company => ({
            id: `company-${company.id}`,
            name: company.name || '',
            categories: ['business'] as ContactCategory[],
            relations: [{
              type: 'company',
              id: company.id,
              name: company.name || ''
            }],
            company: company.name,
            createdAt: company.createdAt,
            updatedAt: company.updatedAt,
            createdBy: user.id,
            updatedBy: user.id
          }));
        allContacts.push(...companyContacts);
      }

      // Create contacts from assets
      if (user.adminData.assetBox) {
        const assetContacts = user.adminData.assetBox
          .filter(asset => asset.type === 'personal')
          .map(asset => ({
            id: `asset-${asset.id}`,
            name: asset.realEstateName || asset.otherAssetName || '',
            categories: ['asset'] as ContactCategory[],
            relations: [{
              type: 'asset',
              id: asset.id,
              name: asset.realEstateName || asset.otherAssetName || ''
            }],
            address: asset.country,
            createdAt: asset.createdAt,
            updatedAt: asset.updatedAt,
            createdBy: user.id,
            updatedBy: user.id
          }));
        allContacts.push(...assetContacts);
      }

      setContacts(allContacts);
    }
  }, [user?.adminData, user?.id]);

  const handleAddContact = (contact: Contact) => {
    setContacts(prev => [...prev, contact]);
    setShowForm(false);
  };

  const handleEditContact = (contact: Contact) => {
    setContacts(prev => prev.map(c => c.id === contact.id ? contact : c));
    setShowForm(false);
    setSelectedContact(null);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
  };

  const filteredContacts = contacts.filter(contact => {
    // Category filter
    if (activeCategory !== 'all' && !contact.categories.includes(activeCategory)) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        contact.name.toLowerCase().includes(query) ||
        contact.email?.toLowerCase().includes(query) ||
        contact.phone?.includes(query) ||
        contact.company?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const categoryCounts = {
    all: contacts.length,
    family: contacts.filter(c => c.categories.includes('family')).length,
    business: contacts.filter(c => c.categories.includes('business')).length,
    asset: contacts.filter(c => c.categories.includes('asset')).length,
    professional: contacts.filter(c => c.categories.includes('professional')).length,
    personal: contacts.filter(c => c.categories.includes('personal')).length,
    other: contacts.filter(c => c.categories.includes('other')).length,
  };

  // Get related data for the contact form
  const familyMembers = user?.adminData?.familyBox || [];
  const companies = user?.adminData?.assetBox?.filter(asset => asset.type === 'company') || [];
  const assets = user?.adminData?.assetBox?.filter(asset => asset.type === 'personal') || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Contacts</h2>
          <p className="text-sm text-gray-500 mt-1">
            {filteredContacts.length} of {contacts.length} contacts
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedContact(null);
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center rounded-full w-10 h-10 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <ContactTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        counts={categoryCounts}
      />

      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <button
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Filter className="h-5 w-5 mr-2 text-gray-400" />
          Filters
        </button>
      </div>

      <ContactList
        contacts={filteredContacts}
        onEdit={(contact) => {
          setSelectedContact(contact);
          setShowForm(true);
        }}
        onDelete={handleDeleteContact}
      />

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <ContactForm
                contact={selectedContact}
                onSubmit={selectedContact ? handleEditContact : handleAddContact}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedContact(null);
                }}
                familyMembers={familyMembers}
                companies={companies}
                assets={assets}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};