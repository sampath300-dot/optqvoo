export interface RawJob {
  title: string;
  company: string;
  location: string;
  posted: string;
  source: string;
  reviewFlag: string;
  description: string;
  skills: string[];
  category: string;
  jobType: string;
  applyUrl: string;
}

export const rawJobs: RawJob[] = [
  {
    title: 'Graduate Engineer Trainee',
    company: 'GE HealthCare',
    location: 'Bengaluru, Karnataka',
    posted: 'Today',
    source: 'GE HealthCare Careers',
    reviewFlag: 'This specific opening is marked filled on the employer page.',
    description: 'Graduate opportunity in Bengaluru. The employer page currently says this opening has been filled; use the link to check related roles on GE HealthCare Careers.',
    skills: ['Engineering fundamentals', 'Problem solving', 'Communication'],
    category: 'Graduate & Trainee',
    jobType: 'Graduate programme',
    applyUrl: 'https://careers.gehealthcare.com/global/en/job/GEVGHLGLOBALR4044790EXTERNALENGLOBAL/Graduate-Engineer-Trainee'
  },
  {
    title: 'Graduate Engineer Trainee',
    company: 'boAt',
    location: 'Mysuru, Karnataka',
    posted: 'Today',
    source: 'MyInternships',
    reviewFlag: 'Review the listing for eligibility and deadline.',
    description: 'An early-career engineering opportunity in Mysuru. Review the listing for the engineering stream, eligibility criteria and application timeline before applying.',
    skills: ['Engineering fundamentals', 'Problem solving', 'Teamwork'],
    category: 'Graduate & Trainee',
    jobType: 'Graduate programme',
    applyUrl: 'https://myinternships.in/jobs/boat-graduate-engineer-trainee-mysuru-f23b49'
  },
  {
    title: 'Graduate Engineers Trainee (Test Cell)',
    company: 'Safran',
    location: 'Hyderabad, Telangana',
    posted: '2026-09-23',
    source: 'GetHyrd',
    reviewFlag: 'Review the listing for eligibility and deadline.',
    description: 'Support aviation-engine testing and test-cell operations, including technical checks, troubleshooting, calibration and documentation. The listing notes that shift work may be required.',
    skills: ['Engine testing', 'Technical documentation', 'Data acquisition'],
    category: 'Graduate & Trainee',
    jobType: 'Full-time · Permanent',
    applyUrl: 'https://gethyrd.in/job/safran-graduate-engineers-trainee-hyderabad/'
  },
  {
    title: 'Design & Management Trainee',
    company: 'HAL',
    location: 'Multiple locations, India',
    posted: '2026-08-08',
    source: 'JobInsider',
    reviewFlag: 'Review the listing for eligibility and deadline.',
    description: 'A 52-week trainee programme for fresh and recent engineering graduates. Design Trainees support research and design centres, while Management Trainees work across production, overhaul and service divisions.',
    skills: ['Core engineering', 'Design fundamentals', 'Project coordination'],
    category: 'Graduate & Trainee',
    jobType: 'Full-time · Trainee programme',
    applyUrl: 'https://www.jobinsider.in/jobs/hal-recruitment-design-management-trainee-26/'
  },
  {
    title: 'Graduate Engineer Trainee',
    company: 'LTIMindtree (LTM)',
    location: 'India',
    posted: '2026-10-15',
    source: 'JobLeads',
    reviewFlag: 'Review the listing for eligibility and deadline.',
    description: 'Entry-level, full-time programme for the 2027 batch, with training and exposure to multiple skills and technology domains. Candidates should be open to working from development centres across India.',
    skills: ['Programming fundamentals', 'Adaptability', 'Communication'],
    category: 'Graduate & Trainee',
    jobType: 'Full-time · Entry level',
    applyUrl: 'https://www.jobleads.com/in/job/ltm-hiring-2027-graduate-engineer-trainee--india--ef8661d3566a21a45d92d0d6883793799'
  }
];
