import { v4 as uuidv4 } from 'uuid';
import { AdminData, FamilyMember, Asset } from '../types/admin';
import { getGenerationLevel } from './generationUtils';
import { determineInheritanceTaxClass } from './inheritanceTaxUtils';
import { initializeTracking } from '../types/tracking';

export const generateTestData = (): AdminData => {
  const now = new Date().toISOString();
  const adminId = uuidv4();
  const universeId = uuidv4();

  // Create family members with proper metadata
  const familyBox: FamilyMember[] = [
    {
      ...initializeTracking(uuidv4(), adminId),
      firstName: "Maria",
      lastName: "Schmidt",
      relationship: "Spouse",
      birthYear: "",
      exactBirthday: "1978-03-15",
      gender: "female",
      generationLevel: getGenerationLevel("Spouse"),
      taxClass: determineInheritanceTaxClass("Spouse", {
        fromPerson: adminId,
        toPerson: adminId
      }),
      relatedTo: adminId,
      universeId
    },
    {
      ...initializeTracking(uuidv4(), adminId),
      firstName: "Hans",
      lastName: "Weber",
      relationship: "Father",
      birthYear: "1945",
      exactBirthday: "",
      gender: "male",
      generationLevel: getGenerationLevel("Father"),
      taxClass: determineInheritanceTaxClass("Father", {
        fromPerson: adminId,
        toPerson: adminId
      }),
      relatedTo: adminId,
      universeId
    },
    {
      ...initializeTracking(uuidv4(), adminId),
      firstName: "Sophie",
      lastName: "Weber",
      relationship: "Daughter",
      birthYear: "",
      exactBirthday: "2005-08-22",
      gender: "female",
      generationLevel: getGenerationLevel("Daughter"),
      taxClass: determineInheritanceTaxClass("Daughter", {
        fromPerson: adminId,
        toPerson: adminId
      }),
      relatedTo: adminId,
      universeId
    },
    {
      ...initializeTracking(uuidv4(), adminId),
      firstName: "Lana",
      lastName: "Weber",
      relationship: "Sister",
      birthYear: "",
      exactBirthday: "1977-08-22",
      gender: "female",
      generationLevel: getGenerationLevel("Sister"),
      taxClass: determineInheritanceTaxClass("Sister", {
        fromPerson: adminId,
        toPerson: adminId
      }),
      relatedTo: adminId,
      universeId
    }
  ];

  // Create assets with proper metadata
  const assetBox: Asset[] = [
    {
      ...initializeTracking(uuidv4(), adminId),
      type: "company",
      name: "Weber GmbH",
      companyType: "Kapitalgesellschaft",
      country: "Germany",
      universeId
    },
    {
      ...initializeTracking(uuidv4(), adminId),
      type: "personal",
      assetType: "Real estate",
      realEstateType: "Personal Residence",
      realEstateName: "Family Home Munich",
      country: "Germany",
      universeId
    }
  ];

  // Create admin data with complete metadata
  return {
    ...initializeTracking(adminId, adminId),
    firstName: "Thomas",
    lastName: "Weber",
    gender: "male",
    birthYear: "",
    exactBirthday: "1975-06-15",
    country: "Germany",
    generationLevel: "0.0",
    familyBox,
    assetBox,
    universeId,
    role: 'admin',
    status: 'active',
    settings: {
      defaultCurrency: 'EUR',
      defaultLanguage: 'de',
      timezone: 'Europe/Berlin'
    }
  };
};