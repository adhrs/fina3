import { useAuth } from '../contexts/AuthContext';

export const useFamilyContacts = () => {
  const { user } = useAuth();
  
  const familyContacts = user?.adminData?.contacts.filter(
    contact => contact.categories.includes('family')
  ) || [];

  return familyContacts;
}; 