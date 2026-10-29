import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RawJob, rawJobs } from './job-data';

type Tab = 'All roles' | 'Internships';

interface Job {
  title: string;
  company: string;
  location: string;
  posted: string;
  source: string;
  reviewFlag: string;
  description: string;
  skills: string[];
  category: string;
  applyUrl: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  menuOpen = signal(false);
  comingSoon = signal<string | null>(null);
  activeTab = signal<Tab>('All roles');
  query = signal('');
  category = signal('All categories');

  readonly sections = ['Jobs', 'Tech news', 'Founders', 'Startups', 'Events', 'Resources'];
  readonly tabs: Tab[] = ['All roles', 'Internships'];
  readonly categories = ['All categories', 'Software Engineering', 'Full Stack', 'Frontend & Mobile', 'Data & Analytics', 'Cloud & DevOps', 'Quality & Testing', 'Security', 'Support & Consulting', 'AI & ML', 'Internships'];
  readonly jobs = rawJobs.map((job) => this.enrichJob(job)).sort((a, b) => b.posted.localeCompare(a.posted));

  get filteredJobs(): Job[] {
    const search = this.query().trim().toLowerCase();
    return this.jobs.filter((job) => {
      const matchesSearch = !search || `${job.title} ${job.company} ${job.location} ${job.category} ${job.skills.join(' ')}`.toLowerCase().includes(search);
      const matchesTab = this.activeTab() !== 'Internships' || job.category === 'Internships';
      const matchesCategory = this.category() === 'All categories' || job.category === this.category();
      return matchesSearch && matchesTab && matchesCategory;
    });
  }

  setTab(tab: Tab) { this.activeTab.set(tab); }
  showComingSoon(section: string) { this.comingSoon.set(section); this.menuOpen.set(false); }

  private enrichJob(job: RawJob): Job {
    const category = this.getCategory(job.title);
    return {
      ...job,
      category,
      skills: this.getSkills(category, job.title),
      description: job.reviewFlag === 'No obvious flag' ? `Listed on ${job.source}. Review the company page for requirements and eligibility.` : job.reviewFlag
    };
  }

  private getCategory(title: string): string {
    const value = title.toLowerCase();
    if (value.includes('intern')) return 'Internships';
    if (value.includes('security') || value.includes('cyber')) return 'Security';
    if (value.includes('test') || value.includes('qa')) return 'Quality & Testing';
    if (value.includes('devops') || value.includes('site reliability') || value.includes('sre')) return 'Cloud & DevOps';
    if (value.includes('data analyst') || value.includes('business analyst') || value.includes('product analyst')) return 'Data & Analytics';
    if (value.includes('support') || value.includes('consultant')) return 'Support & Consulting';
    if (value.includes('ai') || value.includes('reinforcement')) return 'AI & ML';
    if (value.includes('frontend') || value.includes('react') || value.includes('mobile')) return 'Frontend & Mobile';
    if (value.includes('full stack') || value.includes('full-stack')) return 'Full Stack';
    return 'Software Engineering';
  }

  private getSkills(category: string, title: string): string[] {
    const categorySkills: Record<string, string[]> = {
      'Internships': ['Internship', 'Early career'], 'Security': ['Security', 'Risk analysis'], 'Quality & Testing': ['Testing', 'Automation'],
      'Cloud & DevOps': ['Cloud', 'DevOps'], 'Data & Analytics': ['Analytics', 'SQL'], 'Support & Consulting': ['Technical support', 'Systems'],
      'AI & ML': ['Machine learning', 'Engineering'], 'Frontend & Mobile': ['Frontend', 'Product development'], 'Full Stack': ['Full stack', 'Engineering'],
      'Software Engineering': ['Software engineering', 'Development']
    };
    if (title.toLowerCase().includes('salesforce')) return ['Salesforce', 'Business analysis'];
    if (title.toLowerCase().includes('servicenow')) return ['ServiceNow', 'Business analysis'];
    return categorySkills[category] ?? ['Technology'];
  }
}
