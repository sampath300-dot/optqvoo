import { AfterViewInit, Component, computed, effect, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RawJob, rawJobs } from './job-data';

type Tab = 'All roles' | 'Internships';
type Theme = 'light' | 'dark';
type Page = 'home' | 'jobs' | 'job';

interface Route { page: Page; slug: string | null }

const THEME_KEY = 'optqvo-theme';
const PAGE_PATH: Record<'home' | 'jobs', string> = { home: '/', jobs: '/jobs' };

interface Job {
  slug: string;
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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  host: { '[attr.data-theme]': 'theme()' }
})
export class AppComponent implements OnDestroy, AfterViewInit {
  menuOpen = signal(false);
  comingSoon = signal<string | null>(null);
  activeTab = signal<Tab>('All roles');
  query = signal('');
  category = signal('All categories');
  theme = signal<Theme>(readInitialTheme());
  page = signal<Page>(readRoute().page);
  slug = signal<string | null>(readRoute().slug);
  readonly selectedJob = computed(() => (this.page() === 'job' ? this.jobs.find((job) => job.slug === this.slug()) ?? null : null));

  readonly logoSrc = computed(() => (this.theme() === 'dark' ? 'logo-light.png' : 'logo-brand.png'));
  readonly themeLabel = computed(() => (this.theme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'));

  readonly futureSections = ['Tech news', 'Founders', 'Startups', 'Events', 'Resources'];
  readonly tabs: Tab[] = ['All roles', 'Internships'];
  readonly categories = ['All categories', 'Graduate & Trainee', 'Software Engineering', 'Full Stack', 'Frontend & Mobile', 'Data & Analytics', 'Cloud & DevOps', 'Quality & Testing', 'Security', 'Support & Consulting', 'AI & ML', 'Internships'];
  readonly jobs = rawJobs.map((job) => this.enrichJob(job)).sort((a, b) => b.posted.localeCompare(a.posted));
  readonly featuredJobs = this.jobs.slice(0, 3);
  /** The platform's five areas; everything except Jobs is still being built. */
  readonly pillars = [
    { name: 'Tech news', blurb: 'What shipped, what changed, and why it matters.', live: false },
    { name: 'Startups', blurb: 'New companies, funding rounds and the people behind them.', live: false },
    { name: 'Resources', blurb: 'Guides, tools and references worth keeping.', live: false },
    { name: 'Events', blurb: 'Meetups, talks and campus hiring drives.', live: false },
    { name: 'Jobs', blurb: 'Curated early-career roles with direct application links.', live: true }
  ];

  private readonly popStateHandler = () => {
    const route = readRoute();
    this.page.set(route.page);
    this.slug.set(route.slug);
  };

  constructor() {
    effect(() => applyTheme(this.theme()));
    // stop the page behind the drawer scrolling on touch devices
    effect(() => {
      if (typeof document === 'undefined') return;
      document.body.classList.toggle('drawer-open', this.menuOpen());
    });
    if (typeof window !== 'undefined') window.addEventListener('popstate', this.popStateHandler);
  }

  ngOnDestroy() {
    if (typeof window !== 'undefined') window.removeEventListener('popstate', this.popStateHandler);
  }

  /** Fade out the white first-paint splash once Angular has rendered. */
  ngAfterViewInit() {
    if (typeof document === 'undefined') return;
    const splash = document.getElementById('optqvo-splash');
    if (!splash) return;
    const dismiss = () => {
      splash.classList.add('is-hidden');
      window.setTimeout(() => splash.remove(), 500);
    };
    // two frames so the app's first paint is already committed underneath
    requestAnimationFrame(() => requestAnimationFrame(dismiss));
  }

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
  toggleTheme() { this.theme.set(this.theme() === 'dark' ? 'light' : 'dark'); }

  navigate(page: 'home' | 'jobs') {
    this.page.set(page);
    this.menuOpen.set(false);
    this.comingSoon.set(null);
    if (typeof window === 'undefined') return;
    const path = PAGE_PATH[page];
    if (window.location.pathname !== path) window.history.pushState({ page }, '', path);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  /** From the home page: open the jobs view, optionally pre-filtered by category. */
  goToJobs(category?: string) {
    if (category) {
      this.category.set(category);
      if (category !== 'Internships') this.activeTab.set('All roles');
      this.query.set('');
    }
    this.navigate('jobs');
  }

  /** Open a single listing's detail page; the apply link lives there. */
  openJob(job: Job) {
    this.page.set('job');
    this.slug.set(job.slug);
    this.menuOpen.set(false);
    this.comingSoon.set(null);
    if (typeof window === 'undefined') return;
    const path = `/jobs/${job.slug}`;
    if (window.location.pathname !== path) window.history.pushState({ page: 'job', slug: job.slug }, '', path);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  private enrichJob(job: RawJob): Job {
    const category = job.category || this.getCategory(job.title);
    return {
      ...job,
      category,
      slug: toSlug(`${job.company}-${job.title}`),
      skills: job.skills ?? this.getSkills(category, job.title),
      description: job.description ?? (job.reviewFlag === 'No obvious flag' ? `Listed on ${job.source}. Review the company page for requirements and eligibility.` : job.reviewFlag)
    };
  }

  private getCategory(title: string): string {
    const value = title.toLowerCase();
    if (value.includes('intern')) return 'Internships';
    if (value.includes('trainee') || value.includes('graduate')) return 'Graduate & Trainee';
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
      'Internships': ['Internship', 'Early career'], 'Graduate & Trainee': ['Engineering fundamentals', 'Early career'], 'Security': ['Security', 'Risk analysis'], 'Quality & Testing': ['Testing', 'Automation'],
      'Cloud & DevOps': ['Cloud', 'DevOps'], 'Data & Analytics': ['Analytics', 'SQL'], 'Support & Consulting': ['Technical support', 'Systems'],
      'AI & ML': ['Machine learning', 'Engineering'], 'Frontend & Mobile': ['Frontend', 'Product development'], 'Full Stack': ['Full stack', 'Engineering'],
      'Software Engineering': ['Software engineering', 'Development']
    };
    if (title.toLowerCase().includes('salesforce')) return ['Salesforce', 'Business analysis'];
    if (title.toLowerCase().includes('servicenow')) return ['ServiceNow', 'Business analysis'];
    return categorySkills[category] ?? ['Technology'];
  }
}

function readRoute(): Route {
  if (typeof window === 'undefined') return { page: 'home', slug: null };
  const path = window.location.pathname.replace(/\/+$/, '');
  const detail = path.match(/\/jobs\/([^/]+)$/);
  if (detail) return { page: 'job', slug: decodeURIComponent(detail[1]) };
  if (path.endsWith('/jobs')) return { page: 'jobs', slug: null };
  return { page: 'home', slug: null };
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function readInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme;
  try { window.localStorage.setItem(THEME_KEY, theme); } catch { /* storage unavailable */ }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#08080d' : '#ffffff');
}
