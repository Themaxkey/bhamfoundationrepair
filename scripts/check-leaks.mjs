/**
 * Guards against the single most common error when cloning this template to a
 * new market: a value from the PREVIOUS market left hardcoded in a component.
 *
 * It has happened four times — "Bowling Green" in a heading, a tree-service
 * noun in the schema, robots.txt pointing at the old domain, and a literal
 * "KY" in the footer that survived three manual reviews and was caught by the
 * owner on his phone. Eyes do not catch this. A script does.
 *
 * Run: node scripts/check-leaks.mjs
 * Exits non-zero if anything looks wrong, so it can gate a build.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const cfg = readFileSync('site.config.ts', 'utf8');
const pick = (k) => (cfg.match(new RegExp(`${k}:\\s*'([^']+)'`)) || [])[1];

const CITY  = pick('city');
const STATE = pick('stateAbbr');
const PHONE = pick('phone');
const DOMAIN= pick('domain');

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND',
  'OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules' || e === 'dist' || e === '.git') continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (['.astro', '.ts', '.md', '.txt'].includes(extname(p))) files.push(p);
  }
})('.');

const problems = [];
for (const f of files) {
  if (f.endsWith('site.config.ts')) continue;
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    const at = `${f}:${i + 1}`;

    // a state abbreviation written as a literal, that is not ours
    for (const s of US_STATES) {
      if (s === STATE) continue;
      if (new RegExp(`(['">,]\\s*|,\\s)${s}\\b`).test(line) && !/https?:|[a-z]{2}\.(com|org)/.test(line)) {
        problems.push(`${at}  hardcoded state "${s}" (config says ${STATE})`);
      }
    }
    // a phone number that is not ours
    const phones = line.match(/\(\d{3}\)\s?\d{3}-\d{4}/g) || [];
    for (const p of phones) if (p !== PHONE) problems.push(`${at}  foreign phone ${p} (config says ${PHONE})`);

    // another market's domain
    const doms = line.match(/\b[a-z0-9-]+\.(com|net|org)\b/g) || [];
    for (const d of doms) {
      if (d !== DOMAIN && /tree|foundation|repair|removal/.test(d) && !f.endsWith('README.md')) {
        problems.push(`${at}  foreign domain ${d} (config says ${DOMAIN})`);
      }
    }
    // British spellings — this template keeps drifting into them.
    // Note the endings are spelled out rather than using \w*: "organism" and
    // "realistic" are spelled identically in both dialects, and a lazy
    // organis\w* flags them both. Only the -ise/-isation forms are British.
    // Two classes of miss found in testing, both fixed below:
    //   compounds — \bmetre\b never matches inside "millimetres"
    //   -our words — colour was listed, favour/behaviour/honour were not
    const brit = new RegExp(
      '\\b(' +
      // compounds first — a bare \bmetre\b never matches inside "millimetres"
      '(milli|centi|kilo)?metre(s)?|' +
      // -our family — colour alone was listed and favourable slipped straight past
      '(fav|behavi|hon|lab|vap|end|harb|neighb|rig|arm|clam)our(s|ed|ing|able|ite|hood)?|' +
      // -ise / -isation, spelled out so "organism" and "realistic" are not flagged
      'organis(e|es|ed|ing|ation|ations)|realis(e|es|ed|ing)|' +
      'recognis(e|es|ed|ing)|specialis(e|es|ed|ing|ation)|' +
      'apologis(e|es|ed)|analys(e|es|ed)|' +
      // everything else
      'enquir(y|ies|e|ed|ing)|travelling|travelled|cancelling|' +
      'colour(s|ed|ing|ful)?|centre(s)?|licence(s)?|defence|offence|' +
      'whilst|amongst|catalogue(s)?|programme(s)?|storey(s)?|' +
      'mould(s|y|ing)?|draught(s|y)?|kerb(s)?|tyre(s)?|grey|' +
      'fulfil|instalment(s)?|skilful|enrol|practise(d|s)?|' +
      'litre(s)?|fibre(s)?|theatre(s)?|aluminium' +
      ')\\b', 'i');
    const m = line.match(brit);
    if (m) problems.push(`${at}  British spelling "${m[0]}" — this is a US site`);
  });
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n`);
  for (const p of problems) console.error('  ' + p);
  console.error('');
  process.exit(1);
}
console.log(`clean — checked ${files.length} files against ${CITY}, ${STATE}, ${PHONE}, ${DOMAIN}`);
