import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Contact, ContactCategory, ContactRelation } from '../../types/ContactTypes';
import { FamilyMember } from '../../types/FamilyTypes';
import { Company } from '../../types/CompanyTypes';
import { Asset } from '../../types/AssetTypes';

interface ContactFormProps {
  contact?: Contact;
  onSubmit: (contact: Contact) => void;
  onCancel: () => void;
  familyMembers: FamilyMember[];
  companies: Company[];
  assets: Asset[];
}

export const ContactForm: React.FC<ContactFormProps> = ({
  contact,
  onSubmit,
  onCancel,
  familyMembers,
  companies,
  assets,
}) => {
  const [formData, setFormData] = useState<Partial<Contact>>({
    name: '',
    email: '',
    phone: '',
    categories: [],
    relations: [],
    role: '',
    company: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    if (contact) {
      setFormData(contact);
    }
  }, [contact]);

  const handleCategoryToggle = (category: ContactCategory) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories?.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...(prev.categories || []), category],
    }));
  };

  const handleRelationAdd = (type: ContactRelation['type'], id: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      relations: [
        ...(prev.relations || []),
        { type, id, name }
      ],
    }));
  };

  const handleRelationRemove = (relationId: string) => {
    setFormData(prev => ({
      ...prev,
      relations: prev.relations?.filter(r => r.id !== relationId),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.categories?.length) return;

    const now = new Date().toISOString();
    onSubmit({
      id: contact?.id || crypto.randomUUID(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      categories: formData.categories,
      relations: formData.relations,
      role: formData.role,
      company: formData.company,
      address: formData.address,
      notes: formData.notes,
      createdAt: contact?.createdAt || now,
      updatedAt: now,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          {contact ? 'Edit Contact' : 'Add Contact'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Categories *
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {['family', 'business', 'asset', 'professional', 'personal', 'other'].map((category) => (
              <label
                key={category}
                className="inline-flex items-center"
              >
                <input
                  type="checkbox"
                  checked={formData.categories?.includes(category as ContactCategory)}
                  onChange={() => handleCategoryToggle(category as ContactCategory)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-900 capitalize">{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role/Position
          </label>
          <input
            type="text"
            value={formData.role || ''}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company
          </label>
          <input
            type="text"
            value={formData.company || ''}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <textarea
            rows={2}
            value={formData.address || ''}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            rows={3}
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Related Entities
          </label>
          
          {/* Family Members */}
          <div className="mb-4">
            <select
              onChange={(e) => {
                const member = familyMembers.find(m => m.id === e.target.value);
                if (member) {
                  handleRelationAdd('family', member.id, member.name);
                }
              }}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Add family member...</option>
              {familyMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          {/* Companies */}
          <div className="mb-4">
            <select
              onChange={(e) => {
                const company = companies.find(c => c.id === e.target.value);
                if (company) {
                  handleRelationAdd('company', company.id, company.name);
                }
              }}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Add company...</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          {/* Assets */}
          <div className="mb-4">
            <select
              onChange={(e) => {
                const asset = assets.find(a => a.id === e.target.value);
                if (asset) {
                  handleRelationAdd('asset', asset.id, asset.name);
                }
              }}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Add asset...</option>
              {assets.map(asset => (
                <option key={asset.id} value={asset.id}>
                  {asset.name}
                </option>
              ))}
            </select>
          </div>

          {/* Display selected relations */}
          {formData.relations && formData.relations.length > 0 && (
            <div className="mt-2 space-y-2">
              {formData.relations.map(relation => (
                <div
                  key={relation.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                  <span className="text-sm">
                    <span className="font-medium capitalize">{relation.type}:</span>{' '}
                    {relation.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRelationRemove(relation.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          {contact ? 'Update Contact' : 'Add Contact'}
        </button>
      </div>
    </form>
  );
};