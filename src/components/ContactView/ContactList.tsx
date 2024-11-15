import React from 'react';
import { Mail, Phone, Building2, MapPin, Edit2, Trash2, Tag } from 'lucide-react';
import { Contact } from '../../types/ContactTypes';

interface ContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export const ContactList: React.FC<ContactListProps> = ({
  contacts,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">{contact.name}</h3>
              {contact.role && (
                <p className="text-sm text-gray-500">{contact.role}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(contact)}
                className="p-1 text-gray-400 hover:text-blue-600"
                title="Edit contact"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(contact.id)}
                className="p-1 text-gray-400 hover:text-red-600"
                title="Delete contact"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {contact.email && (
              <div className="flex items-center text-sm text-gray-500">
                <Mail className="w-4 h-4 mr-2" />
                <a href={`mailto:${contact.email}`} className="hover:text-blue-600">
                  {contact.email}
                </a>
              </div>
            )}
            
            {contact.phone && (
              <div className="flex items-center text-sm text-gray-500">
                <Phone className="w-4 h-4 mr-2" />
                <a href={`tel:${contact.phone}`} className="hover:text-blue-600">
                  {contact.phone}
                </a>
              </div>
            )}

            {contact.company && (
              <div className="flex items-center text-sm text-gray-500">
                <Building2 className="w-4 h-4 mr-2" />
                {contact.company}
              </div>
            )}

            {contact.address && (
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-2" />
                {contact.address}
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {contact.categories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                <Tag className="w-3 h-3 mr-1" />
                {category}
              </span>
            ))}
          </div>

          {contact.relations && contact.relations.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Related to:</h4>
              <div className="space-y-1">
                {contact.relations.map((relation) => (
                  <div
                    key={relation.id}
                    className="text-sm text-gray-500"
                  >
                    <span className="capitalize">{relation.type}:</span>{' '}
                    {relation.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {contacts.length === 0 && (
        <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">No contacts found</p>
        </div>
      )}
    </div>
  );
};