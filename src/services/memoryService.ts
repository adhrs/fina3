import { FamilyMember, Relationship } from '../types/FamilyTypes';
import { AdminMember, AdminSettings } from '../types/admin';

const STORAGE_KEYS = {
  MEMBERS: 'familyTree_members',
  RELATIONSHIPS: 'familyTree_relationships',
  ADMIN: 'familyTree_admin',
  SETTINGS: 'familyTree_settings'
} as const;

export class MemoryService {
  private members: Map<string, FamilyMember>;
  private relationships: Map<string, Relationship>;
  private admin: AdminMember | null;
  private adminSettings: AdminSettings | null;
  private static instance: MemoryService;

  private constructor() {
    // Initialize from localStorage if available
    this.members = new Map(JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMBERS) || '[]'));
    this.relationships = new Map(JSON.parse(localStorage.getItem(STORAGE_KEYS.RELATIONSHIPS) || '[]'));
    this.admin = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN) || 'null');
    this.adminSettings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || 'null');
  }

  public static getInstance(): MemoryService {
    if (!MemoryService.instance) {
      MemoryService.instance = new MemoryService();
    }
    return MemoryService.instance;
  }

  private saveToStorage() {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(Array.from(this.members.entries())));
    localStorage.setItem(STORAGE_KEYS.RELATIONSHIPS, JSON.stringify(Array.from(this.relationships.entries())));
    localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(this.admin));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.adminSettings));
  }

  async getAdmin(): Promise<AdminMember | null> {
    return this.admin;
  }

  async setAdmin(admin: AdminMember): Promise<void> {
    this.admin = admin;
    this.saveToStorage();
  }

  async getAdminSettings(): Promise<AdminSettings | null> {
    return this.adminSettings;
  }

  async updateAdminSettings(settings: Partial<AdminSettings>): Promise<void> {
    if (this.adminSettings) {
      this.adminSettings = { ...this.adminSettings, ...settings };
      this.saveToStorage();
    }
  }

  async getFamilyMembers(): Promise<FamilyMember[]> {
    return Array.from(this.members.values());
  }

  async getRelationships(): Promise<Relationship[]> {
    return Array.from(this.relationships.values());
  }

  async addFamilyMember(member: FamilyMember): Promise<void> {
    member.lastUpdated = new Date().toISOString();
    member.lastUpdatedBy = this.admin?.id;
    this.members.set(member.id, member);
    this.saveToStorage();
  }

  async addRelationship(relationship: Relationship): Promise<void> {
    this.relationships.set(relationship.id, relationship);
    this.saveToStorage();
  }

  async getMemberById(id: string): Promise<FamilyMember | null> {
    return this.members.get(id) || null;
  }

  async getRelationshipsForMember(memberId: string): Promise<Relationship[]> {
    return Array.from(this.relationships.values()).filter(
      rel => rel.from === memberId || rel.to === memberId
    );
  }

  async updateMember(id: string, updates: Partial<FamilyMember>): Promise<void> {
    const member = await this.getMemberById(id);
    if (member) {
      const updatedMember = { 
        ...member, 
        ...updates,
        lastUpdated: new Date().toISOString(),
        lastUpdatedBy: this.admin?.id
      };
      this.members.set(id, updatedMember);
      this.saveToStorage();
    }
  }

  // Development helper methods
  async clearStorage(): Promise<void> {
    this.members.clear();
    this.relationships.clear();
    this.admin = null;
    this.adminSettings = null;
    localStorage.clear();
  }
}