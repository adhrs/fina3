import { render, screen, fireEvent } from '@testing-library/react';
import { RelatedMemberForm } from '../../components/FamilyView/RelatedMemberForm';
import { describe, it, expect, vi } from 'vitest';
import { FamilyMember } from '../../types/FamilyTypes';
import { AuthProvider } from '../../contexts/AuthContext';
import '@testing-library/jest-dom';

// Mock AuthContext
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      adminData: {
        id: 'test-admin-id',
        universeId: 'test-universe'
      }
    }
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children
}));

describe('RelatedMemberForm', () => {
  const baseMember: FamilyMember = {
    id: 'test-id',
    firstName: 'Test',
    lastName: 'Admin',
    relationship: 'Admin',
    gender: 'male',
    birthYear: '1980',
    exactBirthday: '1980-01-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  };

  const mockSubmit = vi.fn();
  const mockCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(
      <AuthProvider>
        <RelatedMemberForm
          baseMember={baseMember}
          members={[]}
          onSubmit={mockSubmit}
          onCancel={mockCancel}
        />
      </AuthProvider>
    );

    expect(screen.getByLabelText(/relationship to/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
  });

  it('shows gender field only for Spouse', async () => {
    render(
      <AuthProvider>
        <RelatedMemberForm
          baseMember={baseMember}
          members={[]}
          onSubmit={mockSubmit}
          onCancel={mockCancel}
        />
      </AuthProvider>
    );

    // Initially gender field should not be visible
    expect(screen.queryByLabelText(/gender/i)).not.toBeInTheDocument();

    // Select Spouse relationship
    fireEvent.change(screen.getByLabelText(/relationship to/i), {
      target: { value: 'Spouse' }
    });

    // Now gender field should be visible
    expect(await screen.findByLabelText(/gender/i)).toBeInTheDocument();
  });

  it('prevents duplicate relationships', async () => {
    const existingMember: FamilyMember = {
      ...baseMember,
      id: 'spouse-id',
      relationship: 'Spouse',
      relatedTo: baseMember.id
    };

    render(
      <AuthProvider>
        <RelatedMemberForm
          baseMember={baseMember}
          members={[existingMember]}
          onSubmit={mockSubmit}
          onCancel={mockCancel}
        />
      </AuthProvider>
    );

    // Try to add another Spouse
    const relationshipSelect = screen.getByLabelText(/relationship to/i);
    fireEvent.change(relationshipSelect, { target: { value: 'Spouse' } });
    
    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: 'Another' } });
    
    const lastNameInput = screen.getByLabelText(/last name/i);
    fireEvent.change(lastNameInput, { target: { value: 'Spouse' } });
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(mockSubmit).not.toHaveBeenCalled();
  });
}); 