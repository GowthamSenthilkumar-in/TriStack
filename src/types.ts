export type Role = 'student' | 'staff' | 'admin';

export type CertificateType =
  | 'bonafide'
  | 'conduct'
  | 'course'
  | 'academic'
  | 'workshop'
  | 'internship'
  | 'sports'
  | 'paper';

export type CertificateCategory =
  | 'Academic Excellence'
  | 'Technical'
  | 'Workshop'
  | 'Cultural'
  | 'Sports'
  | 'Internship'
  | 'NPTEL/Coursera'
  | 'Bonafide'
  | 'Conduct'
  | string;

export type CertificateStatus = 'verified' | 'pending' | 'needs_review' | 'rejected';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  department?: string;
  registerNumber?: string;
  avatar?: string;
  createdAt: string;
  isGoogleUser?: boolean;
  status?: 'active' | 'suspended';
}

export interface CertificateItem {
  id: string;
  certificateId: string; // e.g., BAIT/AIW/2026/0742
  certificateNo?: string; // alias for certificateId if needed
  studentId: string;
  studentName: studentNameStr;
  department?: string;
  registerNumber?: string;
  studentRegNo?: string;
  studentDept?: string;
  studentEmail?: string;
  certificateType?: CertificateType;
  category?: CertificateCategory;
  title: string;
  organizationOrDept?: string;
  issuer?: string;
  issueDate: string;
  eventDate?: string;
  purpose?: string;
  academicYear?: string;
  periodOfStudy?: string;
  conductRating?: string;
  degree?: string;
  grade?: string;
  fatherName?: string;
  status: CertificateStatus;
  qrCodeUrl: string;
  fileUrl?: string;
  ocrExtractedText?: string;
  ocrMatchScore?: number;
  ocrConfidence?: number;
  ocrFlags?: string[];
  isPinned?: boolean;
  remarks?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  ledgerHash?: string;
  templateTheme?: 'classic' | 'modern' | 'gold';
  signatureTitle?: string;
  createdAt: string;
}

type studentNameStr = string;

export interface CertificateRequest {
  id: string;
  studentId: string;
  studentName: string;
  department: string;
  registerNumber: string;
  certificateType: CertificateType;
  title: string;
  organizationOrDept: string;
  eventDate: string;
  description: string;
  purpose?: string;
  academicYear?: string;
  periodOfStudy?: string;
  conductRating?: string;
  degree?: string;
  grade?: string;
  fatherName?: string;
  status: 'pending' | 'approved' | 'rejected';
  remarks?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  fileUrl?: string;
  certificateId?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  userRole: Role;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  actionLink?: string;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  action: string;
  targetId?: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export type ThemeMode = 'system' | 'light' | 'dark';

export interface VerificationResult {
  isValid: boolean;
  certificate?: CertificateItem;
  message: string;
  matchScore?: number;
}
