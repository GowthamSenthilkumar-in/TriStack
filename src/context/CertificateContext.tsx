import React, { createContext, useContext, useState, useEffect } from 'react';
import { CertificateItem, CertificateRequest } from '../types';

interface CertificateContextType {
  certificates: CertificateItem[];
  requests: CertificateRequest[];
  uploadStudentCertificate: (data: Partial<CertificateItem>) => Promise<CertificateItem>;
  uploadCertificate: (data: Partial<CertificateItem>) => Promise<CertificateItem>;
  requestCertificate: (data: Partial<CertificateItem>) => Promise<CertificateItem>;
  checkDuplicate: (titleStr: string, issuerStr?: string) => CertificateItem | null;
  createOfficialCertificate: (data: Partial<CertificateItem>) => Promise<CertificateItem>;
  approveCertificate: (id: string, reviewerName: string) => void;
  rejectCertificate: (id: string, reason: string, reviewerName: string) => void;
  deleteCertificate: (id: string) => void;
  togglePinCertificate: (id: string) => void;
  getCertificateById: (id: string) => CertificateItem | undefined;
  getCertificateByNo: (certNo: string) => CertificateItem | undefined;
  getCertificateByHash: (hash: string) => CertificateItem | undefined;
}

const CertificateContext = createContext<CertificateContextType | undefined>(undefined);

const INITIAL_CERTIFICATES: CertificateItem[] = [];

export const CertificateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [certificates, setCertificates] = useState<CertificateItem[]>(() => {
    const saved = localStorage.getItem('certifyx_certificates');
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });

  const [requests, setRequests] = useState<CertificateRequest[]>(() => {
    const saved = localStorage.getItem('certifyx_requests');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('certifyx_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('certifyx_requests', JSON.stringify(requests));
  }, [requests]);

  // Sync from server on mount
  useEffect(() => {
    const fetchServerData = async () => {
      try {
        const certRes = await fetch('/api/certificates');
        if (certRes.ok) {
          const certData = await certRes.json();
          if (certData.success && Array.isArray(certData.certificates)) {
            setCertificates(certData.certificates);
          }
        }
        const reqRes = await fetch('/api/requests');
        if (reqRes.ok) {
          const reqData = await reqRes.json();
          if (reqData.success && Array.isArray(reqData.requests)) {
            setRequests(reqData.requests);
          }
        }
      } catch (err) {
        console.error('Failed to sync from backend:', err);
      }
    };
    fetchServerData();
  }, []);

  const uploadStudentCertificate = async (data: Partial<CertificateItem>): Promise<CertificateItem> => {
    const newId = `cert-${Date.now()}`;
    const newCert: CertificateItem = {
      id: newId,
      certificateId: data.certificateId || `BAIT/STD/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: data.studentId || 'std-108',
      studentName: data.studentName || 'Student',
      department: data.department || 'Computer Science and Engineering',
      registerNumber: data.registerNumber || '7376241CS108',
      certificateType: data.certificateType || 'workshop',
      title: data.title || 'Submitted Certificate',
      organizationOrDept: data.organizationOrDept || 'External Body',
      issueDate: data.issueDate || new Date().toISOString().split('T')[0],
      eventDate: data.eventDate,
      status: 'pending',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BAIT-VERIFY-${newId}`,
      fileUrl: data.fileUrl || 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=800&q=80',
      ocrExtractedText: data.ocrExtractedText,
      ocrMatchScore: data.ocrMatchScore || 95,
      ocrFlags: data.ocrFlags || [],
      isPinned: false,
      createdAt: new Date().toISOString()
    };

    setCertificates((prev) => [newCert, ...prev]);

    // Send server call to persist and trigger staff notifications
    try {
      await fetch('/api/certificates/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCert)
      });
    } catch (err) {
      console.warn('Backend sync error on certificate upload:', err);
    }

    return newCert;
  };

  const uploadCertificate = uploadStudentCertificate;

  const requestCertificate = async (data: Partial<CertificateItem>): Promise<CertificateItem> => {
    const newId = `cert-req-${Date.now()}`;
    const generatedCertNo = data.certificateId || `BAIT/REQ/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;

    const newCert: CertificateItem = {
      id: newId,
      certificateId: generatedCertNo,
      studentId: data.studentId || 'std-108',
      studentName: data.studentName || 'Student',
      department: data.department || 'Computer Science and Engineering',
      registerNumber: data.registerNumber || '7376241CS108',
      certificateType: data.certificateType || 'bonafide',
      title: data.title || 'Certificate Request',
      organizationOrDept: data.organizationOrDept || 'Bannari Amman Institute of Technology',
      issueDate: data.issueDate || new Date().toISOString().split('T')[0],
      eventDate: data.eventDate || new Date().toISOString().split('T')[0],
      status: 'pending',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BAIT-REQ-${newId}`,
      purpose: data.purpose,
      academicYear: data.academicYear,
      periodOfStudy: data.periodOfStudy,
      conductRating: data.conductRating,
      degree: data.degree,
      grade: data.grade,
      fatherName: data.fatherName,
      isPinned: false,
      createdAt: new Date().toISOString()
    };

    const newReq: CertificateRequest = {
      id: `req-${Date.now()}`,
      studentId: data.studentId || 'std-108',
      studentName: data.studentName || 'Student',
      department: data.department || 'Computer Science and Engineering',
      registerNumber: data.registerNumber || '7376241CS108',
      certificateType: (data.certificateType as any) || 'bonafide',
      title: data.title || 'Certificate Request',
      organizationOrDept: data.organizationOrDept || 'Bannari Amman Institute of Technology',
      eventDate: data.eventDate || new Date().toISOString().split('T')[0],
      description: (data as any).description || `Requested ${data.certificateType} certificate`,
      status: 'pending',
      certificateId: generatedCertNo,
      createdAt: new Date().toISOString()
    };

    setCertificates((prev) => [newCert, ...prev]);
    setRequests((prev) => [newReq, ...prev]);

    // Send to backend API to persist & trigger staff notifications
    try {
      await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: newCert.studentId,
          studentName: newCert.studentName,
          department: newCert.department,
          registerNumber: newCert.registerNumber,
          certificateType: newCert.certificateType,
          title: newCert.title,
          organizationOrDept: newCert.organizationOrDept,
          eventDate: newCert.eventDate,
          description: (data as any).description || newCert.purpose
        })
      });
    } catch (err) {
      console.warn('Backend sync error on request submission:', err);
    }

    return newCert;
  };

  const checkDuplicate = (titleStr: string, issuerStr?: string): CertificateItem | null => {
    if (!titleStr || !titleStr.trim()) return null;
    const cleanTitle = titleStr.trim().toLowerCase();
    const cleanIssuer = (issuerStr || '').trim().toLowerCase();
    return (
      certificates.find((c) => {
        const matchTitle =
          (c.title || '').toLowerCase().includes(cleanTitle) || cleanTitle.includes((c.title || '').toLowerCase());
        const matchIssuer = cleanIssuer ? (c.organizationOrDept || '').toLowerCase().includes(cleanIssuer) : true;
        return matchTitle && matchIssuer;
      }) || null
    );
  };

  const createOfficialCertificate = async (data: Partial<CertificateItem>): Promise<CertificateItem> => {
    const newId = `cert-off-${Date.now()}`;
    const certNo = `BAIT/GEN/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;

    const newCert: CertificateItem = {
      id: newId,
      certificateId: certNo,
      studentId: data.studentId || 'std-108',
      studentName: data.studentName || 'Student',
      department: data.department || 'Computer Science and Engineering',
      registerNumber: data.registerNumber || '7376241CS108',
      certificateType: data.certificateType || 'course',
      title: data.title || 'Institutional Certificate of Merit',
      organizationOrDept: data.organizationOrDept || 'Bannari Amman Institute of Technology',
      issueDate: data.issueDate || new Date().toISOString().split('T')[0],
      status: 'verified',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BAIT-OFFICIAL-${certNo}`,
      isPinned: false,
      reviewedBy: data.reviewedBy || 'Faculty Issuer',
      reviewedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    setCertificates((prev) => [newCert, ...prev]);
    return newCert;
  };

  const approveCertificate = (id: string, reviewerName: string) => {
    setCertificates((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'verified',
              reviewedBy: reviewerName,
              reviewedAt: new Date().toISOString(),
              remarks: 'Approved by faculty verifier. Stored on digital ledger.'
            }
          : c
      )
    );
    setRequests((prev) =>
      prev.map((r) =>
        r.certificateId === id || r.id === id
          ? {
              ...r,
              status: 'approved',
              reviewedBy: reviewerName,
              reviewedAt: new Date().toISOString()
            }
          : r
      )
    );
  };

  const rejectCertificate = (id: string, reason: string, reviewerName: string) => {
    setCertificates((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'rejected',
              remarks: reason,
              reviewedBy: reviewerName,
              reviewedAt: new Date().toISOString()
            }
          : c
      )
    );
    setRequests((prev) =>
      prev.map((r) =>
        r.certificateId === id || r.id === id
          ? {
              ...r,
              status: 'rejected',
              remarks: reason,
              reviewedBy: reviewerName,
              reviewedAt: new Date().toISOString()
            }
          : r
      )
    );
  };

  const deleteCertificate = (id: string) => {
    setCertificates((prev) => prev.filter((c) => c.id !== id));
  };

  const togglePinCertificate = (id: string) => {
    setCertificates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c))
    );
  };

  const getCertificateById = (id: string) => certificates.find((c) => c.id === id);

  const getCertificateByNo = (certNo: string) =>
    certificates.find((c) => {
      const target = (certNo || '').trim().toLowerCase();
      const id1 = (c.certificateId || '').toLowerCase();
      const id2 = (c.certificateNo || '').toLowerCase();
      return target.length > 0 && (id1 === target || id2 === target);
    });

  const getCertificateByHash = (hash: string) =>
    certificates.find((c) => {
      const target = (hash || '').trim().toLowerCase();
      if (!target) return false;
      const id = (c.id || '').toLowerCase();
      const certId = (c.certificateId || '').toLowerCase();
      const certNo = (c.certificateNo || '').toLowerCase();
      return id === target || certId === target || certNo === target;
    });

  return (
    <CertificateContext.Provider
      value={{
        certificates,
        requests,
        uploadStudentCertificate,
        uploadCertificate,
        requestCertificate,
        checkDuplicate,
        createOfficialCertificate,
        approveCertificate,
        rejectCertificate,
        deleteCertificate,
        togglePinCertificate,
        getCertificateById,
        getCertificateByNo,
        getCertificateByHash
      }}
    >
      {children}
    </CertificateContext.Provider>
  );
};

export const useCertificates = () => {
  const context = useContext(CertificateContext);
  if (!context) {
    throw new Error('useCertificates must be used within a CertificateProvider');
  }
  return context;
};
