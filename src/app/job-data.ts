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
    title: 'Software Development Engineer Intern (Jan 2027, 6 months)',
    company: 'Amazon',
    location: 'India',
    posted: 'Today',
    source: 'Amazon Jobs',
    reviewFlag: 'Confirm the open locations and eligibility on the Amazon Jobs page.',
    description: 'Six-month software development internship for the January 2027 intake, listed under Amazon University Talent Acquisition. The Amazon Jobs page carries the current location list, eligibility rules and application steps.',
    skills: ['Data structures & algorithms', 'Programming fundamentals', 'Problem solving'],
    category: 'Internships',
    jobType: 'Internship · 6 months',
    applyUrl: 'https://www.amazon.jobs/en/jobs/10517894/software-development-engineer-intern-jan-2027-6-month-amazon-university-talent-acquisition'
  },
  {
    title: 'Software Engineer',
    company: 'Cisco',
    location: 'India',
    posted: 'Today',
    source: 'Cisco Careers',
    reviewFlag: 'Check the requisition on Cisco Careers for the hiring location and requirements.',
    description: 'Full-time software engineering role posted on Cisco Careers. Review the requisition for the team, technology stack and experience requirements before applying.',
    skills: ['Software development', 'Networking fundamentals', 'Problem solving'],
    category: 'Software Engineering',
    jobType: 'Full-time',
    applyUrl: 'https://careers.cisco.com/global/en/job/CISCISGLOBAL2027271EXTERNALENGLOBAL/Software-Engineer'
  },
  {
    title: 'Intern Bachelors Software Eng',
    company: 'Honeywell',
    location: 'India',
    posted: 'Today',
    source: 'Honeywell Careers',
    reviewFlag: 'Confirm the site location and internship term on the Honeywell Careers page.',
    description: "Bachelor's-level software engineering internship listed on Honeywell Careers. Use the employer page for the site location, internship term dates and eligibility details.",
    skills: ['Software engineering', 'Programming fundamentals', 'Teamwork'],
    category: 'Internships',
    jobType: 'Internship',
    applyUrl: 'https://careers.honeywell.com/en/sites/Honeywell/jobs/preview/160480/?keyword=Software+Engineer+I&location=India'
  },
  {
    title: 'Analyst, Procurement Tech',
    company: 'Deloitte',
    location: 'Pune, Maharashtra',
    posted: 'Today',
    source: 'Deloitte South Asia Careers',
    reviewFlag: 'Verify the eligibility criteria and deadline on Deloitte Careers.',
    description: 'Analyst role in the Supply Chain & Network Operations practice, based in Pune. The Deloitte posting lists the responsibilities, required skills and application process.',
    skills: ['Procurement technology', 'Supply chain', 'Analytical thinking'],
    category: 'Support & Consulting',
    jobType: 'Full-time',
    applyUrl: 'https://southasiacareers.deloitte.com/job/Pune-Analyst-S&P-Procurement-Tech-Pune-Supply-Chain-&-Network-Operations/59940844/'
  },
  {
    title: 'Graduate Engineer Trainee — Campus Hiring Drive',
    company: 'Superset',
    location: 'India',
    posted: 'Today',
    source: 'Superset',
    reviewFlag: 'Create a student profile on Superset to view the drive and apply.',
    description: 'Campus hiring drive for graduate engineer trainees, run through the Superset student platform. Create a student profile on Superset to view the drive details and submit an application.',
    skills: ['Engineering fundamentals', 'Aptitude', 'Communication'],
    category: 'Graduate & Trainee',
    jobType: 'Graduate programme',
    applyUrl: 'https://app.joinsuperset.com/join/#/signup/student/jobprofiles/fb6d8dff-4b11-42d8-a47d-bb4c80c5eab1'
  }
];
