import fs from 'fs';
import path from 'path';
import { User, CertificateItem, CertificateRequest, NotificationItem, AuditLogItem } from '../src/types';

interface DatabaseSchema {
  users: User[];
  certificates: CertificateItem[];
  requests: CertificateRequest[];
  notifications: NotificationItem[];
  auditLogs: AuditLogItem[];
  credentials: Record<string, string>; // email -> password
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'certifyx.json');

const defaultUsers: User[] = [
  {
    id: 'user_student_1',
    email: 'student@gmail.com',
    name: 'Student User',
    role: 'student',
    department: 'Computer Science and Engineering',
    registerNumber: '7376241CS108',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user_staff_1',
    email: 'staff@gmail.com',
    name: 'Faculty Staff',
    role: 'staff',
    department: 'Computer Science and Engineering',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user_admin_1',
    email: 'admin@gmail.com',
    name: 'System Admin',
    role: 'admin',
    department: 'Office of Academics',
    createdAt: new Date().toISOString()
  }
];

const defaultCredentials: Record<string, string> = {
  'student@gmail.com': '12345',
  'staff@gmail.com': '12345',
  'admin@gmail.com': '12345'
};

class DBManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        return {
          users: parsed.users || defaultUsers,
          certificates: parsed.certificates || [],
          requests: parsed.requests || [],
          notifications: parsed.notifications || [],
          auditLogs: parsed.auditLogs || [],
          credentials: { ...defaultCredentials, ...(parsed.credentials || {}) }
        };
      }
    } catch (err) {
      console.error('Error reading database file:', err);
    }

    // Default state: Vault starts empty!
    const initialData: DatabaseSchema = {
      users: defaultUsers,
      certificates: [], // Empty state on first use
      requests: [],
      notifications: [],
      auditLogs: [
        {
          id: 'log_init',
          userId: 'user_admin_1',
          userName: 'System Admin',
          userRole: 'admin',
          action: 'SYSTEM_INITIALIZED',
          details: 'CertifyX database initialized with empty vault and default institutional accounts.',
          timestamp: new Date().toISOString()
        }
      ],
      credentials: defaultCredentials
    };

    this.saveData(initialData);
    return initialData;
  }

  private saveData(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const content = JSON.stringify(dataToSave || this.data, null, 2);
      fs.writeFileSync(DB_FILE, content, 'utf-8');
    } catch (err) {
      console.error('Failed to save database file:', err);
    }
  }

  // --- Users ---
  getUsers() {
    return this.data.users;
  }

  getUserByEmail(email: string) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string) {
    return this.data.users.find((u) => u.id === id);
  }

  verifyCredentials(email: string, pass: string): User | null {
    const storedPass = this.data.credentials[email.toLowerCase()];
    if (storedPass && storedPass === pass) {
      return this.getUserByEmail(email) || null;
    }
    return null;
  }

  createUser(user: User, password?: string): User {
    const existing = this.getUserByEmail(user.email);
    if (existing) return existing;

    this.data.users.push(user);
    if (password) {
      this.data.credentials[user.email.toLowerCase()] = password;
    }
    this.addAuditLog(user.id, user.name, user.role, 'USER_REGISTERED', `User ${user.name} (${user.role}) registered account.`);
    this.saveData();
    return user;
  }

  deleteUser(userId: string) {
    const idx = this.data.users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      const u = this.data.users[idx];
      this.data.users.splice(idx, 1);
      delete this.data.credentials[u.email.toLowerCase()];
      this.saveData();
      return true;
    }
    return false;
  }

  // --- Certificates ---
  getCertificates(filter?: { studentId?: string; status?: string }) {
    let result = [...this.data.certificates];
    if (filter?.studentId) {
      result = result.filter((c) => c.studentId === filter.studentId);
    }
    if (filter?.status) {
      result = result.filter((c) => c.status === filter.status);
    }
    return result;
  }

  getCertificateByCertId(certId: string) {
    const cleanId = certId.trim().toUpperCase();
    return this.data.certificates.find((c) => c.certificateId.toUpperCase() === cleanId || c.id === certId);
  }

  addCertificate(cert: CertificateItem) {
    this.data.certificates.unshift(cert);
    this.addAuditLog(
      cert.studentId,
      cert.studentName,
      'student',
      'CERTIFICATE_ADDED',
      `Certificate ${cert.certificateId} (${cert.title}) added to vault.`
    );
    this.saveData();
    return cert;
  }

  updateCertificateStatus(certId: string, status: CertificateItem['status'], reviewedBy: string, remarks?: string) {
    const cert = this.data.certificates.find((c) => c.id === certId || c.certificateId === certId);
    if (cert) {
      cert.status = status;
      cert.reviewedBy = reviewedBy;
      cert.reviewedAt = new Date().toISOString();
      if (remarks) cert.remarks = remarks;
      this.saveData();
      return cert;
    }
    return null;
  }

  togglePinCertificate(certId: string) {
    const cert = this.data.certificates.find((c) => c.id === certId);
    if (cert) {
      cert.isPinned = !cert.isPinned;
      this.saveData();
      return cert;
    }
    return null;
  }

  deleteCertificate(certId: string, actor: User) {
    const idx = this.data.certificates.findIndex((c) => c.id === certId || c.certificateId === certId);
    if (idx !== -1) {
      const deleted = this.data.certificates[idx];
      this.data.certificates.splice(idx, 1);
      this.addAuditLog(
        actor.id,
        actor.name,
        actor.role,
        'CERTIFICATE_DELETED',
        `Permanent deletion of certificate ID ${deleted.certificateId} (${deleted.title})`
      );
      this.saveData();
      return true;
    }
    return false;
  }

  // --- Requests ---
  getRequests(filter?: { studentId?: string; status?: string }) {
    let res = [...this.data.requests];
    if (filter?.studentId) {
      res = res.filter((r) => r.studentId === filter.studentId);
    }
    if (filter?.status) {
      res = res.filter((r) => r.status === filter.status);
    }
    return res;
  }

  getRequestById(id: string) {
    return this.data.requests.find((r) => r.id === id);
  }

  addRequest(req: CertificateRequest) {
    this.data.requests.unshift(req);
    this.addAuditLog(
      req.studentId,
      req.studentName,
      'student',
      'REQUEST_SUBMITTED',
      `Submitted request for ${req.certificateType} certificate: "${req.title}".`
    );

    // Send notification to staff
    const staffUsers = this.data.users.filter((u) => u.role === 'staff');
    staffUsers.forEach((staff) => {
      this.addNotification({
        id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        userId: staff.id,
        userRole: 'staff',
        title: 'New Certificate Request',
        message: `${req.studentName} requested a ${req.certificateType} certificate for "${req.title}".`,
        type: 'info',
        read: false,
        actionLink: '/staff/pending-requests',
        createdAt: new Date().toISOString()
      });
    });

    this.saveData();
    return req;
  }

  updateRequestStatus(
    requestId: string,
    status: 'approved' | 'rejected',
    staff: User,
    remarks?: string,
    generatedCertId?: string
  ) {
    const req = this.data.requests.find((r) => r.id === requestId);
    if (!req) return null;

    req.status = status;
    req.remarks = remarks;
    req.reviewedBy = staff.name;
    req.reviewedAt = new Date().toISOString();
    if (generatedCertId) {
      req.certificateId = generatedCertId;
    }

    // Send notification to student
    this.addNotification({
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId: req.studentId,
      userRole: 'student',
      title: `Certificate Request ${status.toUpperCase()}`,
      message:
        status === 'approved'
          ? `Your request for "${req.title}" has been approved! Certificate ID: ${generatedCertId}`
          : `Your request for "${req.title}" was rejected. Reason: ${remarks || 'Invalid details'}`,
      type: status === 'approved' ? 'success' : 'error',
      read: false,
      actionLink: status === 'approved' ? '/student/vault' : '/student/status',
      createdAt: new Date().toISOString()
    });

    this.addAuditLog(
      staff.id,
      staff.name,
      staff.role,
      `REQUEST_${status.toUpperCase()}`,
      `Staff ${staff.name} ${status} request ${req.id} for ${req.studentName}.`
    );

    this.saveData();
    return req;
  }

  // --- Notifications ---
  getNotifications(userId: string) {
    return this.data.notifications.filter((n) => n.userId === userId);
  }

  addNotification(notif: NotificationItem) {
    this.data.notifications.unshift(notif);
    this.saveData();
    return notif;
  }

  markNotificationRead(id: string, userId: string) {
    const n = this.data.notifications.find((notif) => notif.id === id && notif.userId === userId);
    if (n) {
      n.read = true;
      this.saveData();
      return true;
    }
    return false;
  }

  markAllNotificationsRead(userId: string) {
    let updated = false;
    this.data.notifications.forEach((n) => {
      if (n.userId === userId && !n.read) {
        n.read = true;
        updated = true;
      }
    });
    if (updated) this.saveData();
    return updated;
  }

  clearAllNotifications(userId: string) {
    const initialCount = this.data.notifications.length;
    this.data.notifications = this.data.notifications.filter((n) => n.userId !== userId);
    if (this.data.notifications.length !== initialCount) {
      this.saveData();
      return true;
    }
    return false;
  }

  // --- Audit Logs ---
  getAuditLogs() {
    return this.data.auditLogs;
  }

  addAuditLog(userId: string, userName: string, userRole: User['role'], action: string, details: string) {
    const log: AuditLogItem = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId,
      userName,
      userRole,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    this.data.auditLogs.unshift(log);
    // Limit to 500 logs
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 500);
    }
    this.saveData();
    return log;
  }
}

export const db = new DBManager();
