# Birmingham Foundation Repair

Lead-generation site for foundation and crawl space work across Birmingham,
Jefferson County and north Shelby County, Alabama.

Astro static build, served from a Cloudflare Worker. Same architecture as
bgtreeremoval.com and huntsvillecrawlspacerepair.com — `site.config.ts` is the
only file that differs between markets, plus the content in `src/content/`.

**Status: live.** The number is real, the icons are in, the hero form delivers
leads through Resend, and Email Routing carries info@. The one thing still
outstanding is photography.

## How this deploys

Push to `main` on GitHub. Cloudflare Workers Builds runs `npm run build` then
`npx wrangler deploy`. There is no manual step.

Two things about that pipeline have bitten us more than once, both silently:

- **`wrangler deploy` overwrites plain vars.** Anything in the Worker's
  Variables list that is not also declared in `wrangler.jsonc` is wiped by the
  next build. Secrets are exempt. That is why `LEAD_TO`, `LEAD_FROM` and
  `VOICEMAIL_TOKEN` are committed and `RESEND_KEY` is not.
- **Adding a secret creates a version, it does not deploy it.** The Settings
  page will show the secret and the running Worker will still not have it. Go
  to Deployments and check that the blue marker sits on the newest row. If it
  does not, promote it. This has cost us an hour on each of three sites.

## Content rules that are easy to get wrong

- **US spellings and US idiom throughout.** Not just `-ise`/`-our`: the ones
  that actually got through were `autumn`, `skirting board`, `guttering`,
  `garden` for a yard, `ring us` for call us, and `fortnight`. Run
  `node scripts/check-leaks.mjs` before every commit — it exists because a
  hardcoded `KY` survived three manual reviews.
- No heading without content beneath it.
- No claims about years in business, crew size or credentials. Nothing on this
  site should be a thing we cannot stand behind.
- **Every page needs a unique `seoTitle`.** The service page and the homepage
  both shipped as "Foundation Repair Birmingham, AL | Free Inspection", which
  put our own two strongest pages in competition for the same query. Titles
  under 62 characters, descriptions between 70 and 165.

## Town pages: the rule changed

The original rule here was "do not add town pages for places with no recorded
search volume", and Trussville, Gardendale, Chelsea, Calera and Moody were
excluded on that basis.

**That reasoning was wrong and the Huntsville build reverses it.** Ahrefs
reported zero organic keywords for bgtreeremoval.com at a point when Search
Console showed it genuinely ranking for `russellville ky tree removal` and
`tree pruning warren county ky`. An Ahrefs zero at town granularity is the
floor of its sampling, not evidence of no demand. A town page costs one
markdown file, and Bowling Green's best positions by far are its town pages.

If we revisit this market, add the five excluded towns.

## Commands

```
npm install
npm run dev                    # local preview
npm run build                  # static build into ./dist
node scripts/check-leaks.mjs   # fails on another market's state, phone or domain
```
