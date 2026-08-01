import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { CertificateItem, CertificateRequest, User } from '../src/types';

interface Notification {
  id: string;
  userId: string;
  userRole: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  actionLink?: string;
  createdAt: string;
}

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  message: string;
  timestamp: string;
}

interface DbShape {
  users: User[];
  credentials: Record<string, string>; // email -> salt:hash
  certificates: CertificateItem[];
  requests: CertificateRequest[];
  notifications: Notification[];
  auditLogs: AuditLog[];
}

// ---- Storage location -----------------------------------------------
// Allow overriding via env var so you can point this at a Render
// Persistent Disk mount path (e.g. DB_DIR=/data) without touching code.
const DB_DIR = process.env.DB_DIR || path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');
const TMP_FILE = path.join(DB_DIR, 'db.json.tmp');

function emptyDb(): DbShape {
  return { users: [], credentials: {}, certificates: [], requests: [], notifications: [], auditLogs: [] };
}

function loadDb(): DbShape {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      if (raw.trim().length > 0) {
        const parsed = JSON.parse(raw);
        // Backfill any keys that might be missing from an older file shape
        return { ...emptyDb(), ...parsed };
      }
    }
  } catch (err) {
    console.error('[db] Failed to read existing db.json, starting fresh. Error:', err);
    // Preserve the corrupted file for forensics instead of silently losing it
    try {
      if (fs.existsSync(DB_FILE)) {
        fs.copyFileSync(DB_FILE, `${DB_FILE}.corrupt-${Date.now()}.bak`);
      }
    } catch {
      /* best effort */
    }
  }
  return emptyDb();
}

// In-memory cache, hydrated once from disk at module load time.
let state: DbShape = loadDb();

// Atomic write: write to a temp file then rename over the real file.
// This means a crash mid-save can never leave db.json half-written.
function persist() {
  fs.mkdirSync(DB_DIR, { recursive: true });
  fs.writeFileSync(TMP_FILE, JSON.stringify(state, null, 2), 'utf-8');
  fs.renameSync(TMP_FILE, DB_FILE);
}

// ---- Password hashing (scrypt, no extra dependency needed) -----------
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const check = crypto.scryptSync(password, salt, 64).toString('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(check, 'hex'));
  } catch {
    return false;
  }
}

// ---- Normalization helper for certificate ID lookups ------------------
function normalizeId(id: string): string {
  return decodeURIComponent(String(id || '')).trim().toLowerCase();
}

// ---- Normalization helper for credential keys -------------------------
// All credentials are keyed by lowercased/trimmed email, consistently,
// everywhere. This is the single source of truth for that key.
function credKey(email: string): string {
  return String(email || '').trim().toLowerCase();
}

export const db = {
  saveData() {
    persist();
  },

  // ---------------- Users -----------------
  getUsers(): User[] {
    return state.users;
  },

  getUserById(id: string): User | undefined {
    return state.users.find((u) => u.id === id);
  },

  getUserByEmail(email: string): User | undefined {
    const target = credKey(email);
    return state.users.find((u) => u.email.trim().toLowerCase() === target);
  },

  createUser(user: User, password?: string): User {
    state.users.push(user);
    if (password) {
      state.credentials[credKey(user.email)] = hashPassword(password);
    }
    persist();
    return user;
  },

  deleteUser(id: string): boolean {
    const before = state.users.length;
    const user = state.users.find((u) => u.id === id);
    state.users = state.users.filter((u) => u.id !== id);
    if (user) {
      delete state.credentials[credKey(user.email)];
    }
    persist();
    return state.users.length < before;
  },

  verifyCredentials(email: string, password: string): User | null {
    const user = this.getUserByEmail(email);
    if (!user) return null;
    const stored = state.credentials[credKey(email)];
    if (!stored) return null;
    return verifyPassword(password, stored) ? user : null;
  },

  // ---------------- Certificates -----------------
  getCertificates(filter: { studentId?: string; status?: string } = {}): CertificateItem[] {
    return state.certificates.filter((c) => {
      if (filter.studentId && c.studentId !== filter.studentId) return false;
      if (filter.status && c.status !== filter.status) return false;
      return true;
    });
  },

  // Looks up by EITHER the internal id (cert_...) OR the public certificateId
  // (e.g. BAIT/AIW/2026/1234). Normalized so whitespace/case/url-encoding
  // never causes a false "not found".
  getCertificateByCertId(idOrCertId: string): CertificateItem | undefined {
    const target = normalizeId(idOrCertId);
    return state.certificates.find(
      (c) => normalizeId(c.certificateId) === target || normalizeId(c.id) === target
    );
  },

  addCertificate(cert: CertificateItem): CertificateItem {
    state.certificates.push(cert);
    persist();
    return cert;
  },

  togglePinCertificate(id: string): CertificateItem | null {
    const cert = this.getCertificateByCertId(id);
    if (!cert) return null;
    cert.isPinned = !cert.isPinned;
    persist();
    return cert;
  },

  deleteCertificate(id: string, _actor: User): boolean {
    const before = state.certificates.length;
    state.certificates = state.certificates.filter(
      (c) => normalizeId(c.id) !== normalizeId(id) && normalizeId(c.certificateId) !== normalizeId(id)
    );
    const deleted = state.certificates.length < before;
    if (deleted) persist();
    return deleted;
  },

  // ---------------- Requests -----------------
  getRequests(filter: { studentId?: string; status?: string } = {}): CertificateRequest[] {
    return state.requests.filter((r) => {
      if (filter.studentId && r.studentId !== filter.studentId) return false;
      if (filter.status && r.status !== filter.status) return false;
      return true;
    });
  },

  getRequestById(id: string): CertificateRequest | undefined {
    return state.requests.find((r) => r.id === id);
  },

  addRequest(request: CertificateRequest): CertificateRequest {
    state.requests.push(request);
    persist();
    return request;
  },

  updateRequestStatus(
    id: string,
    status: string,
    staff: User,
    remarks?: string,
    certId?: string
  ): CertificateRequest | undefined {
    const request = this.getRequestById(id);
    if (!request) return undefined;
    (request as any).status = status;
    (request as any).reviewedBy = staff.name;
    (request as any).reviewedAt = new Date().toISOString();
    if (remarks) (request as any).remarks = remarks;
    if (certId) (request as any).certificateId = certId;
    persist();
    return request;
  },

  // ---------------- Notifications -----------------
  getNotifications(userId: string): Notification[] {
    return state.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  addNotification(notification: Notification): Notification {
    state.notifications.push(notification);
    persist();
    return notification;
  },

  markNotificationRead(id: string, userId: string): boolean {
    const n = state.notifications.find((n) => n.id === id && n.userId === userId);
    if (!n) return false;
    n.read = true;
    persist();
    return true;
  },

  markAllNotificationsRead(userId: string): boolean {
    let changed = false;
    state.notifications.forEach((n) => {
      if (n.userId === userId && !n.read) {
        n.read = true;
        changed = true;
      }
    });
    if (changed) persist();
    return true;
  },

  clearAllNotifications(userId: string): boolean {
    const before = state.notifications.length;
    state.notifications = state.notifications.filter((n) => n.userId !== userId);
    if (state.notifications.length !== before) persist();
    return true;
  },

  // ---------------- Audit logs -----------------
  addAuditLog(userId: string, userName: string, userRole: string, action: string, message: string): AuditLog {
    const entry: AuditLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId,
      userName,
      userRole,
      action,
      message,
      timestamp: new Date().toISOString()
    };
    state.auditLogs.push(entry);
    persist();
    return entry;
  },

  getAuditLogs(): AuditLog[] {
    return state.auditLogs.slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
};

// ---- Seed default demo accounts if the DB is empty -------------------
// Runs once at boot. Render's free tier disk isn't persistent, so
// db.json can vanish on any restart — this guarantees the demo
// logins always work again after that happens.
if (state.users.length === 0) {
  const defaults: { id: string; email: string; name: string; role: User['role']; department: string; password: string }[] = [
    { id: 'user_student_1', email: 'student@gmail.com', name: 'Student User', role: 'student', department: 'Computer Science and Engineering', password: '12345' },
    { id: 'user_staff_1',   email: 'staff@gmail.com',   name: 'Faculty Staff', role: 'staff',   department: 'Computer Science and Engineering', password: '12345' },
    { id: 'user_admin_1',   email: 'admin@gmail.com',   name: 'System Admin',  role: 'admin',    department: 'Office of Academics',              password: '12345' },
  ];
  for (const d of defaults) {
    const user = { id: d.id, email: d.email, name: d.name, role: d.role, department: d.department, createdAt: new Date().toISOString() } as User;
    state.users.push(user);
    state.credentials[credKey(user.email)] = hashPassword(d.password);
  }
  persist();
  console.log('[db] Seeded default demo users (student, staff, admin).');
}
