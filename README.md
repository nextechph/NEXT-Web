# NEXT Technology

Next.js App Router website with server-rendered public content and Supabase-backed administration.

## Run locally

Requires Node.js 20.9 or later.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production build:

```sh
npm run build
npm start
```

Copy `.env.example` to `.env.local` to change the Supabase project or canonical site URL. The existing project's **public anon key** is retained as a default so existing content and admin accounts continue working. Never put a service-role key in a `NEXT_PUBLIC_` variable. Database permissions continue to be enforced by Supabase RLS.

## Routes

- `/`: homepage, services, FAQs
- `/templates`: website designs, previews, customization inquiry
- `/second-boot`: PC revival, custom builds, hardware services
- `/portfolio`, `/team`, `/blog`: server-rendered Supabase content
- `/blog/[id]`: published articles, individual metadata, sanitized article body
- `/planner`, `/contact`: pricing wizard and inquiries
- `/admin-auth`, `/admin`: existing Supabase sign-in and content editors

Old `.html` URLs permanently redirect to the corresponding routes. `/article.html?id=…` redirects through `/article` to `/blog/[id]`, retaining existing article links. Unknown/unpublished articles return a 404.

## Content and administration

Public database content is fetched on the server with fresh reads on each request. Saved admin changes are visible on the next page load, without a deployment. Missing/unavailable template tables fall back to the existing starter content. An intentionally saved empty catalog stays empty.

If not already applied, run `supabase_sections.sql` in the Supabase SQL Editor to enable template and Second Boot editing. Other existing tables and RLS policies are unchanged.

The public pages, navigation, footer, template previews, filters, newsletter, contact form, and sign-in are React components. The pricing planner and existing admin editors retain their tested imperative code in `legacy/`; `scripts/prepare-legacy.mjs` generates their compatibility inputs before development/build. Edit those source workflows under `legacy/pages/` and `legacy/scripts/`. They initialize once after React mounts and use full document navigation to preserve the lifecycle of existing global handlers. The remaining archived HTML files are visual/source references; public pages use native React components and no archived HTML file is served as a public page.

Shared styling is `app/globals.css`; shared components are in `components/`. Existing image assets are under `public/assets/`.

## Verification

```sh
npm test
npm run build
```

Browser checks use a local Supabase fixture and intercept browser API requests; they never write to the production database. On this Mac they use the installed Brave browser; elsewhere install Chromium or set `PLAYWRIGHT_EXECUTABLE_PATH`:

```sh
npm run test:e2e
```

If no supported browser is installed, run `npx playwright install chromium` first.

## Deploy

The included Vercel configuration selects Next.js. Use `npm run build` and the Next.js framework preset; do not set a static output directory. Set the variables from `.env.example` in the hosting environment if overriding the existing project. `npm start` also supports a Node server.

No production deployment is performed by the migration itself.

## Search and AI discovery

Public content is server-rendered with canonical URLs and page-specific descriptions. Shared Organization/WebSite entities, visible breadcrumbs, service descriptions, article dates/publisher information, and visible question-and-answer content produce matching JSON-LD. Hidden services are excluded from service catalogs. The sitemap includes published articles only, and unknown or unpublished URLs return a branded 404 with `noindex` and recovery links. Social sharing uses the generated 1200 × 630 `/opengraph-image`.

Set optional `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` codes to verify the domain in those services. After deployment, submit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools. These account-side actions are not performed by the code.

GEO improvements use clear, attributable content and standard crawlability rather than hidden AI instructions or fabricated business details. No special AI schema or `llms.txt` file is required by Google’s AI-search guidance, and indexing, rankings, and AI citations remain decisions of the respective search services. See [Google’s AI features guidance](https://developers.google.com/search/docs/appearance/ai-features) and [Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization).
