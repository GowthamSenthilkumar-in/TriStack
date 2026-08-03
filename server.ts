import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { CertificateItem, CertificateRequest, User } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '25mb' }));

  // --- API ROUTES FIRST ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'CertifyX API Server', timestamp: new Date().toISOString() });
  });

  // Auth: Login with password
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.verifyCredentials(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. Please check email and password.' });
    }

    db.addAuditLog(user.id, user.name, user.role, 'USER_LOGIN', `Successful login for ${user.email}`);
    return res.json({ success: true, user });
  });

  // Auth: Register new user
  app.post('/api/auth/register', (req, res) => {
    const { email, password = '12345', name, role = 'student', department, registerNumber } = req.body;
    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required for registration' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists. Please log in instead.' });
    }

    const newUser: User = {
      id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      email,
      name,
      role: role as User['role'],
      department: department || (role === 'student' ? 'Computer Science and Engineering' : 'Faculty of Engineering'),
      registerNumber: registerNumber || (role === 'student' ? '7376' + Math.floor(10000 + Math.random() * 90000) : undefined),
      createdAt: new Date().toISOString()
    };

    const saved = db.createUser(newUser, password);
    db.addAuditLog(saved.id, saved.name, saved.role, 'USER_REGISTERED', `New account created: ${saved.email}`);
    return res.json({ success: true, user: saved });
  });

  // Auth: Google Sign-in / Sign-up
  app.post('/api/auth/google', (req, res) => {
    const { email, name, role = 'student', department, registerNumber } = req.body;
    const finalEmail = (email || 'gowthams.cs25@bitsathy.ac.in').toLowerCase().trim();
    const finalName = (name || 'Gowtham S').trim();

    let user = db.getUserByEmail(finalEmail);
    if (!user) {
      // Create new Google user with selected role
      user = {
        id: 'user_g_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        email: finalEmail,
        name: finalName,
        role: role as User['role'],
        department: department || (role === 'student' ? 'Computer Science and Engineering' : 'Faculty of Engineering'),
        registerNumber: registerNumber || (role === 'student' ? '7376251CS194' : undefined),
        createdAt: new Date().toISOString(),
        isGoogleUser: true
      };
      db.createUser(user);
    } else {
      if (registerNumber && user.role === 'student') user.registerNumber = registerNumber;
      if (name) user.name = name;
      if (role) user.role = role as User['role'];
      if (department) user.department = department;
      db.saveData();
    }

    db.addAuditLog(user.id, user.name, user.role, 'GOOGLE_AUTH', `Authenticated via Google: ${user.email}`);
    return res.json({ success: true, user });
  });

  // Certificates: Get list
  app.get('/api/certificates', (req, res) => {
    const { studentId, status } = req.query;
    const certs = db.getCertificates({
      studentId: studentId as string,
      status: status as string
    });
    res.json({ success: true, certificates: certs });
  });

  // Certificates: Get single by Cert ID or UUID
app.get('/api/certificates/*', (req, res) => {
  const rawId = (req.params as any)[0] ?? '';
  const cert = db.getCertificateByCertId(decodeURIComponent(rawId));
  if (!cert) {
    return res.status(404).json({ error: 'Certificate not found' });
  }
  res.json({ success: true, certificate: cert });
});

  // Certificates: Submit new certificate request (supports both endpoints)
  const handleCertificateRequest = (req: any, res: any) => {
    const {
      studentId,
      studentName,
      department,
      registerNumber,
      certificateType = 'bonafide',
      title,
      organizationOrDept,
      eventDate,
      description
    } = req.body;

    if (!studentId || !title) {
      return res.status(400).json({ error: 'Missing required request fields' });
    }

    const typePrefixes: Record<string, string> = {
      workshop: 'AIW',
      course: 'CRS',
      paper: 'PPR',
      sports: 'SPT',
      bonafide: 'BNF',
      internship: 'INT'
    };

    const prefix = typePrefixes[certificateType] || 'CRT';
    const year = new Date().getFullYear();
    const seq = Math.floor(1000 + Math.random() * 9000);
    const generatedCertId = `BAIT/${prefix}/${year}/${seq}`;

    const newRequest: CertificateRequest = {
      id: 'req_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      studentId,
      studentName: studentName || 'Student',
      department: department || 'Computer Science and Engineering',
      registerNumber: registerNumber || '7376241CS001',
      certificateType: certificateType as any,
      title,
      organizationOrDept: organizationOrDept || 'Bannari Amman Institute of Technology',
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      description: description || '',
      status: 'pending',
      certificateId: generatedCertId,
      createdAt: new Date().toISOString()
    };

    const created = db.addRequest(newRequest);

    // Notify staff verifiers for review
    const staffMembers = db.getUsers().filter((u) => u.role === 'staff');
    staffMembers.forEach((staff) => {
      db.addNotification({
        id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        userId: staff.id,
        userRole: 'staff',
        title: 'New Certificate Request Received',
        message: `${newRequest.studentName} requested ${newRequest.certificateType.toUpperCase()} certificate ("${newRequest.title}").`,
        type: 'info',
        read: false,
        actionLink: '/staff/pending-requests',
        createdAt: new Date().toISOString()
      });
    });

    res.json({ success: true, request: created, generatedCertId });
  };

  app.post('/api/certificates/request', handleCertificateRequest);
  app.post('/api/requests', handleCertificateRequest);

  // Certificates: Direct Student Upload for Verification & Vault Storage
  app.post('/api/certificates/upload', (req, res) => {
    const {
      studentId,
      studentName,
      department,
      registerNumber,
      certificateType,
      title,
      organizationOrDept,
      eventDate,
      fileUrl,
      ocrExtractedText,
      ocrMatchScore,
      ocrFlags
    } = req.body;

    if (!studentId || !title) {
      return res.status(400).json({ error: 'Missing required certificate details' });
    }

    const typePrefixes: Record<string, string> = {
      workshop: 'AIW',
      course: 'CRS',
      paper: 'PPR',
      sports: 'SPT',
      bonafide: 'BNF',
      internship: 'INT'
    };

    const prefix = typePrefixes[certificateType || 'workshop'] || 'CRT';
    const year = new Date().getFullYear();
    const seq = Math.floor(1000 + Math.random() * 9000);
    const certId = `BAIT/${prefix}/${year}/${seq}`;

    // Determine initial status based on OCR confidence
    let initialStatus: CertificateItem['status'] = 'pending';
    const score = ocrMatchScore || 0;
    if (score >= 85) {
      initialStatus = 'verified';
    } else if (score >= 50) {
      initialStatus = 'needs_review';
    } else {
      initialStatus = 'needs_review';
    }

    const newCert: CertificateItem = {
      id: 'cert_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      certificateId: certId,
      studentId,
      studentName: studentName || 'Student',
      department: department || 'Computer Science and Engineering',
      registerNumber: registerNumber || '7376241CS001',
      certificateType: certificateType || 'workshop',
      title,
      organizationOrDept: organizationOrDept || 'Bannari Amman Institute of Technology',
      issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      status: initialStatus,
      qrCodeUrl: `/verify/${encodeURIComponent(certId)}`,
      fileUrl: fileUrl || undefined,
      ocrExtractedText: ocrExtractedText || '',
      ocrMatchScore: score,
      ocrFlags: ocrFlags || [],
      isPinned: false,
      createdAt: new Date().toISOString()
    };

    const saved = db.addCertificate(newCert);

    // Also notify staff for verification queue
    const staffList = db.getUsers().filter((u) => u.role === 'staff');
    staffList.forEach((s) => {
      db.addNotification({
        id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        userId: s.id,
        userRole: 'staff',
        title: 'Uploaded Certificate Verification Needed',
        message: `${studentName} uploaded a certificate "${title}" (OCR Score: ${score}%).`,
        type: score < 80 ? 'warning' : 'info',
        read: false,
        actionLink: '/staff/pending-requests',
        createdAt: new Date().toISOString()
      });
    });

    res.json({ success: true, certificate: saved });
  });

  // Certificates: Pin/Unpin
  app.patch('/api/certificates/:id/pin', (req, res) => {
    const cert = db.togglePinCertificate(req.params.id);
    if (!cert) return res.status(404).json({ error: 'Certificate not found' });
    res.json({ success: true, certificate: cert });
  });

  // Certificates: Delete certificate permanently
  app.delete('/api/certificates/:id', (req, res) => {
    const { userId } = req.body;
    const actor = userId ? db.getUserById(userId) : null;

    const success = db.deleteCertificate(req.params.id, actor || { id: 'anon', name: 'User', role: 'student', email: '', createdAt: '' });
    if (!success) return res.status(404).json({ error: 'Certificate not found or already deleted' });

    res.json({ success: true, message: 'Certificate deleted permanently from vault' });
  });

  // Requests: Get list
  app.get('/api/requests', (req, res) => {
    const { studentId, status } = req.query;
    const requests = db.getRequests({
      studentId: studentId as string,
      status: status as string
    });
    res.json({ success: true, requests });
  });

  // Requests: Staff Approve or Reject Request
  app.patch('/api/requests/:id/review', (req, res) => {
    const { staffId, status, remarks } = req.body;
    if (!staffId || !status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Staff ID and valid status (approved/rejected) are required' });
    }

    const staff = db.getUserById(staffId);
    if (!staff || (staff.role !== 'staff' && staff.role !== 'admin')) {
      return res.status(403).json({ error: 'Only staff or admin can review requests' });
    }

    const request = db.getRequestById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    let certId = request.certificateId;
    if (status === 'approved') {
      if (!certId) {
        const typePrefixes: Record<string, string> = {
          workshop: 'AIW',
          course: 'CRS',
          paper: 'PPR',
          sports: 'SPT',
          bonafide: 'BNF',
          internship: 'INT'
        };
        const prefix = typePrefixes[request.certificateType] || 'CRT';
        certId = `BAIT/${prefix}/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
      }

      // Create official verified certificate in student vault!
      const newCert: CertificateItem = {
        id: 'cert_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        certificateId: certId,
        studentId: request.studentId,
        studentName: request.studentName,
        department: request.department,
        registerNumber: request.registerNumber,
        certificateType: request.certificateType,
        title: request.title,
        organizationOrDept: request.organizationOrDept,
        issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        eventDate: request.eventDate,
        status: 'verified',
        qrCodeUrl: `/verify/${encodeURIComponent(certId)}`,
        reviewedBy: staff.name,
        reviewedAt: new Date().toISOString(),
        remarks: remarks || 'Approved by academic staff',
        createdAt: new Date().toISOString()
      };
      db.addCertificate(newCert);
    }

    const updated = db.updateRequestStatus(req.params.id, status, staff, remarks, certId);
    res.json({ success: true, request: updated });
  });

  // Staff: Direct Certificate Generation
  app.post('/api/certificates/generate', (req, res) => {
    const {
      staffId,
      studentId,
      studentName,
      department,
      registerNumber,
      certificateType,
      title,
      organizationOrDept,
      eventDate
    } = req.body;

    if (!staffId || !studentName || !title) {
      return res.status(400).json({ error: 'Missing required generation details' });
    }

    const staff = db.getUserById(staffId);
    if (!staff || (staff.role !== 'staff' && staff.role !== 'admin')) {
      return res.status(403).json({ error: 'Unauthorized staff action' });
    }

    const typePrefixes: Record<string, string> = {
      workshop: 'AIW',
      course: 'CRS',
      paper: 'PPR',
      sports: 'SPT',
      bonafide: 'BNF',
      internship: 'INT'
    };

    const prefix = typePrefixes[certificateType || 'workshop'] || 'CRT';
    const certId = `BAIT/${prefix}/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;

    const targetStudent = db.getUserById(studentId) || db.getUserByEmail(studentId);

    const newCert: CertificateItem = {
      id: 'cert_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      certificateId: certId,
      studentId: targetStudent ? targetStudent.id : 'user_student_1',
      studentName: studentName,
      department: department || 'Computer Science and Engineering',
      registerNumber: registerNumber || '7376241CS001',
      certificateType: certificateType || 'workshop',
      title: title,
      organizationOrDept: organizationOrDept || 'Bannari Amman Institute of Technology',
      issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      status: 'verified',
      qrCodeUrl: `/verify/${encodeURIComponent(certId)}`,
      reviewedBy: staff.name,
      reviewedAt: new Date().toISOString(),
      remarks: 'Issued directly by institutional staff',
      createdAt: new Date().toISOString()
    };

    const saved = db.addCertificate(newCert);

    // Notify student
    db.addNotification({
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId: newCert.studentId,
      userRole: 'student',
      title: 'New Official Certificate Issued!',
      message: `Staff ${staff.name} issued your official ${certificateType} certificate: "${title}" (${certId}).`,
      type: 'success',
      read: false,
      actionLink: '/student/vault',
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, certificate: saved });
  });

  // Notifications
  app.get('/api/notifications', (req, res) => {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const notifications = db.getNotifications(userId);
    res.json({ success: true, notifications });
  });

  app.patch('/api/notifications/:id/read', (req, res) => {
    const { userId } = req.body;
    const success = db.markNotificationRead(req.params.id, userId);
    res.json({ success });
  });

  app.post('/api/notifications/read-all', (req, res) => {
    const { userId } = req.body;
    const success = db.markAllNotificationsRead(userId);
    res.json({ success });
  });

  app.post('/api/notifications/clear-all', (req, res) => {
    const { userId } = req.body;
    const success = db.clearAllNotifications(userId);
    res.json({ success });
  });

  // Public Certificate Verification URL API
  app.get('/api/verify/*', (req, res) => {
  const rawId = (req.params as any)[0] ?? '';
  const enteredId = decodeURIComponent(rawId);
  const cert = db.getCertificateByCertId(enteredId);
  if (!cert) {
    return res.status(404).json({
      isValid: false,
      message: `Certificate ID "${enteredId}" could not be found in Bannari Amman Institute of Technology ledger.`
    });
  }

    return res.json({
      isValid: cert.status === 'verified',
      certificate: cert,
      matchScore: cert.ocrMatchScore || 100,
      message:
        cert.status === 'verified'
          ? 'OFFICIAL & AUTHENTIC: This digital certificate is genuine and verified by Bannari Amman Institute of Technology.'
          : `STATUS: ${cert.status.toUpperCase()}. This certificate is currently under review by institutional staff.`
    });
  });

  // Admin: High-level analytics & Stats
  app.get('/api/admin/stats', (req, res) => {
    const users = db.getUsers();
    const certs = db.getCertificates();
    const reqs = db.getRequests();

    const studentsCount = users.filter((u) => u.role === 'student').length;
    const staffCount = users.filter((u) => u.role === 'staff').length;
    const totalCertificates = certs.length;
    const pendingRequests = reqs.filter((r) => r.status === 'pending').length;
    const approvedRequests = reqs.filter((r) => r.status === 'approved').length;
    const rejectedRequests = reqs.filter((r) => r.status === 'rejected').length;

    // Type distribution
    const typesCount: Record<string, number> = {
      workshop: 0,
      course: 0,
      paper: 0,
      sports: 0,
      bonafide: 0,
      internship: 0
    };
    certs.forEach((c) => {
      if (typesCount[c.certificateType] !== undefined) {
        typesCount[c.certificateType]++;
      } else {
        typesCount[c.certificateType] = 1;
      }
    });

    res.json({
      success: true,
      stats: {
        totalStudents: studentsCount,
        totalStaff: staffCount,
        totalCertificates,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        verificationRate: totalCertificates > 0 ? Math.round((certs.filter((c) => c.status === 'verified').length / totalCertificates) * 100) : 100,
        typeDistribution: typesCount
      }
    });
  });

  // Admin: User management
  app.get('/api/admin/users', (req, res) => {
    res.json({ success: true, users: db.getUsers() });
  });

  app.post('/api/admin/users', (req, res) => {
    const { name, email, role, department, registerNumber, password } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Name, email and role are required' });
    }

    const newUser: User = {
      id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      email,
      name,
      role,
      department: department || 'Computer Science and Engineering',
      registerNumber: role === 'student' ? registerNumber || '7376' + Math.floor(10000 + Math.random() * 90000) : undefined,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const created = db.createUser(newUser, password || '12345');
    res.json({ success: true, user: created });
  });

  app.delete('/api/admin/users/:id', (req, res) => {
    const success = db.deleteUser(req.params.id);
    res.json({ success });
  });

  // Admin: Audit Logs
  app.get('/api/admin/audit-logs', (req, res) => {
    res.json({ success: true, logs: db.getAuditLogs() });
  });


  // --- VITE MIDDLEWARE SETUP ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CertifyX Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
