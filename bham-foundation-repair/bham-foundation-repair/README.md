# Birmingham Foundation Repair

Lead-generation site for foundation and crawl space work across Birmingham,
Jefferson County and north Shelby County, Alabama.

Astro static build, served from a Cloudflare Worker. Same architecture as
bgtreeremoval.com — `site.config.ts` is the only file that differs between
markets, plus the content in `src/content/`.

## Before this goes live

1. **Phone number.** `site.config.ts` currently holds a placeholder in the
   555-01xx range, which cannot connect to anyone. Buy a Twilio number with a
   205 area code, wire it to a Studio flow, and replace both `phone` and
   `phoneRaw`.
2. **Logo and favicon.** `public/images/logo.png` and `public/favicon.ico` are
   not present yet. The header and JSON-LD both reference the logo.
3. **Resend.** Verify bhamfoundationrepair.com as a sending domain, then add
   `RESEND_KEY` in the Cloudflare dashboard as a **secret** (not a plain var).
4. **Promote the deployment.** Adding variables in the dashboard creates a new
   version but does not deploy it. Check Deployments and promote, or the form
   will report itself unconfigured.

## Content rules that are easy to get wrong

- US spellings throughout. Run the QA sweep before every commit.
- No heading without content beneath it.
- Do not add town pages for places with no recorded search volume. Trussville,
  Gardendale, Chelsea, Calera and Moody were checked and deliberately excluded.
- No claims about years in business, crew size or credentials.

## Commands

```
npm install
npm run dev      # local preview
npm run build    # static build into ./dist
```
