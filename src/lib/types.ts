export type Role = "MEMBER" | "ADMIN" | "SUPER_ADMIN";
export type SubscriptionStatus = "PENDING" | "ACTIVE" | "EXPIRED" | "SUSPENDED";
export type Complexity = "ACCESSIBLE" | "GROUPEMENT" | "CONSORTIUM";
export type CollabStatus = "FORMING" | "ACTIVE" | "SUBMITTED" | "CLOSED";
export type SubmissionStatus = "PREPARING" | "SUBMITTED" | "CLOSED";
export type SubmissionResult = "WON" | "LOST" | "PENDING";

export interface UserSession {
  userId: string;
  email: string;
  role: Role;
  subscriptionStatus: SubscriptionStatus;
}

export interface CompanyProfile {
  id: string;
  name: string;
  registrationNumber: string;
  taxId: string;
  sector: string;
  foundingDate: string;
  email: string;
  phone: string;
  website?: string | null;
  address: string;
  city: string;
  country: string;
  ceoName: string;
  ceoEmail: string;
  ceoPhone: string;
  specialties?: string | null;
  equipment?: string | null;
  employees?: number | null;
  geographicZone?: string | null;
  description?: string | null;
  subscriptionStatus: SubscriptionStatus;
  subscriptionExpiry?: string | null;
}

export interface OpportunityListItem {
  id: string;
  title: string;
  description: string;
  funder: string;
  sector: string;
  complexity: Complexity;
  location?: string | null;
  budget?: string | null;
  closingDate: string;
  isPublished: boolean;
  interestCount: number;
  isSaved: boolean;
  isInterested: boolean;
  createdAt: string;
}

export interface OpportunityDetail extends OpportunityListItem {
  requirements: string[];
  strategicAdvice?: string | null;
  requiredDocs: string[];
  collaborations: CollabSummary[];
}

export interface CollabSummary {
  id: string;
  title: string;
  status: CollabStatus;
  memberCount: number;
}

export interface MemberListItem {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
  company: {
    id: string;
    name: string;
    sector: string;
    city: string;
    subscriptionStatus: SubscriptionStatus;
    subscriptionExpiry?: string | null;
  } | null;
}

export interface DashboardMemberStats {
  opportunitiesCount: number;
  savedCount: number;
  interestedCount: number;
  collaborationsCount: number;
  submissionsCount: number;
  recentOpportunities: OpportunityListItem[];
  myCollaborations: CollabSummary[];
}

export interface DashboardAdminStats {
  totalMembers: number;
  activeMembers: number;
  pendingMembers: number;
  suspendedMembers: number;
  publishedOpportunities: number;
  totalInterests: number;
  totalCollaborations: number;
  sectorBreakdown: { sector: string; count: number }[];
}
