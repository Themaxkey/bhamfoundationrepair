/**
 * THE ONLY FILE THAT CHANGES BETWEEN SITES.
 *
 * Everything else in this repository reads from here: page copy, meta titles,
 * schema, internal links, the phone number, the colors. To launch a new market,
 * copy this repo, edit this file, replace the content in src/content/, deploy.
 *
 * ============================ BEFORE LAUNCH ============================
 * The phone number below is a PLACEHOLDER in the 555-01xx range, which is
 * permanently reserved for fiction and cannot connect to a real person. Buy a
 * Twilio number with a 205 area code, point it at a Studio flow, and replace
 * BOTH `phone` and `phoneRaw` here. Do not launch until that is done — every
 * page, the header, the sticky call bar and the JSON-LD all read from it.
 * =======================================================================
 */

export const site = {
  business: {
    name:      'Birmingham Foundation Repair',
    shortName: 'Bham Foundation Repair',
    phone:     '(205) 555-0100',      // PLACEHOLDER — see note above
    phoneRaw:  '+12055550100',        // PLACEHOLDER — see note above
    email:     'info@bhamfoundationrepair.com',
    domain:    'bhamfoundationrepair.com',
  },

  location: {
    city:      'Birmingham',
    state:     'Alabama',
    stateAbbr: 'AL',
    zip:       '35203',
    county:    'Jefferson County',
    lat:        33.5186,
    lng:       -86.8104,
    radiusMi:   35,
  },

  trade: {
    noun:       'foundation repair',
    nounPlural: 'foundation and crawl space services',
    // schema.org has no FoundationRepair type; HomeAndConstructionBusiness is
    // the correct parent for structural trades.
    schemaType: 'HomeAndConstructionBusiness',
  },

  brand: {
    primary:   '#1f3a5f',
    primaryDk: '#142942',
    accent:    '#d97706',
    ink:       '#111827',
    body:      '#374151',
    surface:   '#f7f9fb',
    logo:      '/images/logo.png',
  },

  legal: {
    disclosure:
      'Requests submitted through this website are shared with local, licensed and insured foundation and crawl space contractors, who will contact you directly using the details you provide.',
  },

  /** Root-level service pages, in nav order. */
  services: [
    { slug: 'foundation-repair',            name: 'Foundation Repair' },
    { slug: 'crawl-space-encapsulation',    name: 'Crawl Space Encapsulation' },
    { slug: 'crawl-space-repair',           name: 'Crawl Space Repair' },
    { slug: 'basement-waterproofing',       name: 'Basement Waterproofing' },
    { slug: 'foundation-inspection',        name: 'Foundation Inspection' },
    { slug: 'foundation-settlement-repair', name: 'Foundation Settlement Repair' },
    { slug: 'foundation-wall-repair',       name: 'Foundation Wall Repair' },
    { slug: 'foundation-crack-repair',      name: 'Foundation Crack Repair' },
    { slug: 'crawl-space-waterproofing',    name: 'Crawl Space Waterproofing' },
    { slug: 'crawl-space-mold-treatment',   name: 'Crawl Space Mold Treatment' },
    { slug: 'crawl-space-insulation',       name: 'Crawl Space Insulation' },
  ],

  /**
   * Suburbs served. Slug pattern must stay `foundation-repair-<town>-al`.
   * Every suburb here has recorded search volume — Trussville, Gardendale,
   * Chelsea, Calera and Moody were deliberately left out because they return
   * zero. Do not add pages for towns nobody searches for.
   */
  towns: [
    { slug: 'foundation-repair-hoover-al',         name: 'Hoover' },
    { slug: 'foundation-repair-homewood-al',       name: 'Homewood' },
    { slug: 'foundation-repair-alabaster-al',      name: 'Alabaster' },
    { slug: 'foundation-repair-vestavia-hills-al', name: 'Vestavia Hills' },
    { slug: 'foundation-repair-mountain-brook-al', name: 'Mountain Brook' },
    { slug: 'foundation-repair-bessemer-al',       name: 'Bessemer' },
    { slug: 'foundation-repair-irondale-al',       name: 'Irondale' },
    { slug: 'foundation-repair-pelham-al',         name: 'Pelham' },
    { slug: 'foundation-repair-leeds-al',          name: 'Leeds' },
    { slug: 'foundation-repair-helena-al',         name: 'Helena' },
  ],

  /** Standalone pages that are not services, towns or FAQs. */
  staticPages: [
    { slug: 'services',                       name: 'Services' },
    { slug: 'service-area',                   name: 'Service Area' },
    { slug: 'foundation-repair-cost',         name: 'Foundation Repair Cost' },
    { slug: 'about',                          name: 'About' },
    { slug: 'contact',                        name: 'Contact' },
    { slug: 'privacy-policy',                 name: 'Privacy Policy' },
    { slug: 'sms-terms-and-conditions',       name: 'SMS Terms and Conditions' },
  ],

  nav: [
    { href: '/',                          label: 'Home' },
    { href: '/services/',                 label: 'Services' },
    { href: '/service-area/',             label: 'Service Area' },
    { href: '/foundation-repair-cost/',   label: 'Costs' },
    { href: '/faq/',                      label: 'FAQ' },
    { href: '/about/',                    label: 'About' },
    { href: '/contact/',                  label: 'Contact' },
  ],
} as const;

export type Site = typeof site;
export default site;
