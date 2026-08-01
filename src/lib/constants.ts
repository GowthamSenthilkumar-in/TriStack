import { CertificateType } from '../types';

export const INSTITUTION_INFO = {
  name: 'BANNARI AMMAN INSTITUTE OF TECHNOLOGY',
  accreditation: '(An Autonomous Institution Affiliated to Anna University, Chennai)',
  address: 'Sathyamangalam, Erode - 638 401, Tamil Nadu, India',
  motto: 'Stay Ahead',
  website: 'www.bitsathy.ac.in',
  established: '1996',
  departments: [
    'Computer Science and Engineering',
    'Information Technology',
    'Artificial Intelligence and Data Science',
    'Electronics and Communication Engineering',
    'Electrical and Electronics Engineering',
    'Mechanical Engineering',
    'Biotechnology',
    'Civil Engineering'
  ]
};

export interface CertificateTypeConfig {
  id: CertificateType;
  label: string;
  badgeColor: string;
  description: string;
  fields: { name: string; label: string; placeholder: string; required: boolean }[];
}

export const CERTIFICATE_TYPES: CertificateTypeConfig[] = [
  {
    id: 'workshop',
    label: 'Workshop / Seminar Participation',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    description: 'Certificate for technical workshops, hands-on seminars, and skill bootcamps.',
    fields: [
      { name: 'title', label: 'Workshop / Seminar Title', placeholder: 'e.g. Artificial Intelligence and Its Applications', required: true },
      { name: 'organizationOrDept', label: 'Organizing Department / Body', placeholder: 'e.g. Department of Computer Science and Engineering', required: true },
      { name: 'eventDate', label: 'Event Date', placeholder: '25th July 2026', required: true }
    ]
  },
  {
    id: 'course',
    label: 'Course Completion Certificate',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    description: 'Official academic certificate for value-added courses and certification tracks.',
    fields: [
      { name: 'title', label: 'Course Title', placeholder: 'e.g. Advanced Full-Stack Web Architecture', required: true },
      { name: 'organizationOrDept', label: 'Department / Academy', placeholder: 'e.g. Department of Computer Science and Engineering', required: true },
      { name: 'eventDate', label: 'Completion Date', placeholder: '30th June 2026', required: true }
    ]
  },
  {
    id: 'paper',
    label: 'Paper Presentation / Conference',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    description: 'Certificate for research paper presentations and national/international symposiums.',
    fields: [
      { name: 'title', label: 'Paper Title / Topic', placeholder: 'e.g. Real-time OCR Verification in Cloud Ecosystems', required: true },
      { name: 'organizationOrDept', label: 'Conference / Symposium Name', placeholder: 'e.g. National Conference on Smart Computing (NCSC-2026)', required: true },
      { name: 'eventDate', label: 'Presentation Date', placeholder: '15th May 2026', required: true }
    ]
  },
  {
    id: 'sports',
    label: 'Sports & Cultural Excellence',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    description: 'Recognition for inter-collegiate tournaments, athletics, and cultural events.',
    fields: [
      { name: 'title', label: 'Achievement / Event Name', placeholder: 'e.g. First Prize - Inter-College Badminton Championship', required: true },
      { name: 'organizationOrDept', label: 'Sports Council / Cultural Club', placeholder: 'e.g. Physical Education Board & Fine Arts Club', required: true },
      { name: 'eventDate', label: 'Tournament Date', placeholder: '10th April 2026', required: true }
    ]
  },
  {
    id: 'bonafide',
    label: 'Conduct & Bonafide Certificate',
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    description: 'Official institutional bonafide verification document for academic purposes.',
    fields: [
      { name: 'title', label: 'Purpose of Bonafide', placeholder: 'e.g. Passport Application / Industrial Visit Verification', required: true },
      { name: 'organizationOrDept', label: 'Academic Cell', placeholder: 'e.g. Office of Academic Affairs', required: true },
      { name: 'eventDate', label: 'Academic Year', placeholder: '2025-2026', required: true }
    ]
  },
  {
    id: 'internship',
    label: 'Internship & Project Completion',
    badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    description: 'Certificate verifying industry internship or capstone project execution.',
    fields: [
      { name: 'title', label: 'Project / Internship Title', placeholder: 'e.g. Cloud-Native Verification Engine Development', required: true },
      { name: 'organizationOrDept', label: 'Industry Partner / Department Lab', placeholder: 'e.g. BIT Innovation & Incubation Centre', required: true },
      { name: 'eventDate', label: 'Duration / Completion Date', placeholder: 'January 2026 - July 2026', required: true }
    ]
  }
];
