# OPTQVO Jobs

Mobile-first Angular job discovery UI for `optqvo.com`.

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:4200`.

## Deploy to Cloudflare Pages

Connect the repository and use:

- Build command: `npm run build`
- Build output directory: `dist/optqvo-web/browser`
- Node version: `22`

The UI is entirely static at this stage, so it is compatible with Cloudflare Pages. Authentication and server-side job-agent endpoints should later be added with Firebase and/or Cloudflare Workers.

## Job data and the next step

The current imported scan is stored in `src/app/job-data.ts`. The recommended next step is **Cloud Firestore**: it works well with Angular/Firebase Authentication, supports search filters by category/location/date, and is straightforward to update from the job-finding agent.

Store each published listing in a `jobs` collection with this shape:

```ts
{
  title: string,
  company: string,
  location: string,
  category: string,
  skills: string[],
  postedAt: Timestamp,
  source: 'Workday' | 'Greenhouse' | 'Lever' | 'Ashby' | 'BambooHR' | string,
  sourceUrl: string,
  reviewFlag: string,
  status: 'published' | 'draft' | 'expired'
}
```

The job-finding agent should write validated records to `draft` first; an editor can then switch them to `published`. Do not store salaries when a source does not provide them—the field can simply be omitted. A profile/resume pipeline can later store extracted skills in the user's document and calculate matching without exposing the original resume publicly.
