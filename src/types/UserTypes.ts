import { FamilyMember } from './FamilyTypes';

type UserRole = 'admin' | 'collaborator';

interface BaseUser {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

interface AdminUser extends BaseUser {
  role: 'admin';
  adminData: {
    id: string;
    universeId: string;
    setupCompleted: boolean;
    familyBox: FamilyMember[];
    settings: {
      defaultCurrency: string;
      defaultLanguage: string;
      timezone: string;
    };
  }
}

interface CollaboratorUser extends BaseUser {
  role: 'collaborator';
  collaboratorData: {
    adminId: string;
    universeId: string;
    permissions: {
      canEdit: boolean;
      canDelete: boolean;
      canInvite: boolean;
    }
  }
}

export type User = AdminUser | CollaboratorUser;

// Helper functions
export const isAdmin = (user?: User): user is AdminUser => {
  return user?.role === 'admin';
};

export const isCollaborator = (user?: User): user is CollaboratorUser => {
  return user?.role === 'collaborator';
};

export const hasPermission = (user?: User, permission?: keyof CollaboratorUser['collaboratorData']['permissions']): boolean => {
  if (!user || !permission) return false;
  if (isAdmin(user)) return true;
  if (isCollaborator(user)) {
    return user.collaboratorData.permissions[permission] || false;
  }
  return false;
}; 