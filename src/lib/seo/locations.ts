export type ServiceAreaTopic = {
  title: string;
  summary: string;
};

export type CommunityPage = {
  slug: string;
  name: string;
  intro: string;
  marketFocus: string;
  audience: string;
  highlights: string[];
  faqs: { question: string; answer: string }[];
};

export type CityPage = {
  slug: string;
  name: string;
  blurb: string;
  communities: CommunityPage[];
};

export type CountyPage = {
  slug: string;
  name: string;
  positioning: string;
  cities: CityPage[];
};

export type LocationSeed = {
  region: string;
  topics: ServiceAreaTopic[];
  counties: CountyPage[];
};

export const locationSeed: LocationSeed = {
  region: "DC, Maryland, and Virginia",
  topics: [
    {
      title: "Listing launch systems",
      summary: "Campaign kits, ad sequencing, and lead routing tuned to neighborhood velocity.",
    },
    {
      title: "Past-client nurture",
      summary: "Retention workflows that keep your title and lending partners top-of-mind year-round.",
    },
    {
      title: "IDX + SEO architecture",
      summary: "Search-ready local pages connected to property funnels and conversion paths.",
    },
  ],
  counties: [
    {
      slug: "fairfax-county",
      name: "Fairfax County",
      positioning:
        "Fairfax County teams need fast listing workflows and hyper-local content that converts high-intent search traffic.",
      cities: [
        {
          slug: "vienna",
          name: "Vienna",
          blurb: "Boutique neighborhoods, move-up families, and strong referral loops demand polished launch operations.",
          communities: [
            {
              slug: "windover-heights",
              name: "Windover Heights",
              intro: "Windover Heights campaigns win when listing stories and school-driven buyer messaging are synchronized.",
              marketFocus: "Move-up sellers and luxury buyers",
              audience: "Top-producing listing agents and lender partners",
              highlights: ["Pre-market seller nurture", "Open house retargeting", "After-close referral triggers"],
              faqs: [
                {
                  question: "What should agents automate first in Windover Heights?",
                  answer:
                    "Start with seller intake and launch-day distribution so every listing deploys with coordinated email, social, and paid traffic the same day.",
                },
                {
                  question: "How does Velocity measure neighborhood campaign quality?",
                  answer:
                    "We track speed-to-lead, showing requests, and downstream appointment rates tied to each local asset.",
                },
              ],
            },
            {
              slug: "westwood-country-club-estates",
              name: "Westwood Country Club Estates",
              intro: "High-consideration buyers in Westwood Country Club Estates respond to premium creative and concierge follow-up.",
              marketFocus: "Luxury repositioning and private-showing demand",
              audience: "Luxury agents, custom builders, and jumbo lenders",
              highlights: ["Luxury listing narratives", "VIP showing funnels", "Builder collaboration pages"],
              faqs: [
                {
                  question: "Can this page support custom builder partnerships?",
                  answer:
                    "Yes. We build co-branded content blocks so builders, lenders, and listing agents share one conversion journey.",
                },
                {
                  question: "Do these campaigns integrate with CRM automations?",
                  answer:
                    "Every neighborhood template syncs to lead routing and nurture workflows inside your existing CRM stack.",
                },
              ],
            },
            {
              slug: "the-shouse-village",
              name: "The Shouse Village",
              intro: "The Shouse Village benefits from lifestyle-first messaging and consistent nurture for repeat and referral business.",
              marketFocus: "Family transitions and repeat listings",
              audience: "Neighborhood specialists and title-focused growth teams",
              highlights: ["Community spotlight content", "Referral request cadence", "Vendor co-marketing automations"],
              faqs: [
                {
                  question: "What content cadence works for Shouse Village listings?",
                  answer:
                    "A 30-day cadence with weekly market snapshots, homeowner tips, and listing inventory updates drives steady engagement.",
                },
                {
                  question: "How quickly can teams launch?",
                  answer:
                    "Most partners launch a neighborhood-ready system in 10 business days with templates and tracked KPIs.",
                },
              ],
            },
            {
              slug: "wolf-trap-woods",
              name: "Wolf Trap Woods",
              intro: "Wolf Trap Woods pages should blend premium positioning with practical local market insights.",
              marketFocus: "Executive relocations and strategic seller prep",
              audience: "Relocation-focused agents and financial partners",
              highlights: ["Relocation landing experiences", "School + commute content", "Listing prep workflows"],
              faqs: [
                {
                  question: "Do relocation campaigns need separate funnels?",
                  answer:
                    "Yes. We isolate relocation traffic with tailored forms, concierge follow-up, and differentiated nurture timing.",
                },
                {
                  question: "Can we track title-order influence?",
                  answer:
                    "We instrument source attribution so you can connect campaign touchpoints to signed contracts and closings.",
                },
              ],
            },
          ],
        },
        {
          slug: "mclean",
          name: "McLean",
          blurb: "McLean growth comes from tight positioning, premium trust signals, and responsive pipeline orchestration.",
          communities: [
            {
              slug: "langley-forest",
              name: "Langley Forest",
              intro: "Langley Forest pages need high-credibility messaging for discerning sellers and global relocation buyers.",
              marketFocus: "Luxury portfolio listings",
              audience: "Senior listing teams and private client advisors",
              highlights: ["Market report hubs", "Concierge intake", "Cross-channel sequencing"],
              faqs: [
                { question: "How do we position premium service locally?", answer: "Use neighborhood proof points, process transparency, and consistent high-touch follow-up from inquiry to close." },
                { question: "Can one template support multiple listing tiers?", answer: "Yes, we use modular sections so teams can deploy entry-luxury and ultra-luxury variants without rebuilding." },
              ],
            },
            {
              slug: "chesterbrook-woods",
              name: "Chesterbrook Woods",
              intro: "Chesterbrook Woods success is driven by fast response systems and trust-rich educational content.",
              marketFocus: "Executive move-up transitions",
              audience: "Agent-lender referral teams",
              highlights: ["Seller readiness calculators", "Buyer intent workflows", "Open house demand scoring"],
              faqs: [
                { question: "What metrics matter for neighborhood funnels?", answer: "Lead-to-showing time, repeat visits, and consult booking rate are core indicators for local conversion health." },
                { question: "Can these pages support co-branded lenders?", answer: "Absolutely. We map co-branded CTAs while preserving clear compliance boundaries and consistent UX." },
              ],
            },
            {
              slug: "salona-village",
              name: "Salona Village",
              intro: "Salona Village campaigns benefit from educational content and segmented homeowner lifecycle messaging.",
              marketFocus: "Family equity moves",
              audience: "Community-centered listing specialists",
              highlights: ["Equity watch funnels", "Segmented nurture journeys", "Neighborhood authority pages"],
              faqs: [
                { question: "How often should local pages be updated?", answer: "Refresh copy and stats monthly, with quarterly structural updates based on search and conversion performance." },
                { question: "Does Velocity provide reporting by community?", answer: "Yes, every community page can have dedicated analytics for rankings, leads, and conversion outcomes." },
              ],
            },
            {
              slug: "franklin-park",
              name: "Franklin Park",
              intro: "Franklin Park requires premium visual storytelling paired with disciplined pipeline operations.",
              marketFocus: "Luxury buyer and seller lifecycle",
              audience: "Luxury broker teams and builder partners",
              highlights: ["Brand-safe media flows", "Luxury lead qualification", "Retention-centric closeout sequences"],
              faqs: [
                { question: "Can this support long-cycle luxury leads?", answer: "Yes, we design nurture logic that keeps intent signals active across multi-month buying windows." },
                { question: "What role does SEO play for referral-heavy teams?", answer: "SEO creates discoverability and authority layers that reinforce referral trust before first contact." },
              ],
            },
          ],
        },
      ],
    },
    {
      slug: "loudoun-county",
      name: "Loudoun County",
      positioning:
        "Loudoun teams need scalable local pages that cover established enclaves and fast-growing communities without duplicate copy.",
      cities: [
        {
          slug: "ashburn",
          name: "Ashburn",
          blurb: "Ashburn search demand rewards clear neighborhood context and rapid multi-channel follow-up.",
          communities: [
            { slug: "brambleton", name: "Brambleton", intro: "Brambleton sellers respond to data-driven launch playbooks and polished digital positioning.", marketFocus: "Family resale inventory", audience: "Neighborhood listing teams", highlights: ["Launch scorecards", "Community intel briefs", "Lead-priority alerts"], faqs: [{ question: "How fast should new listings publish across channels?", answer: "Within the first 24 hours, with synchronized social, email, and paid distribution for maximum early momentum." }, { question: "What keeps Ashburn nurture relevant?", answer: "Segmenting by homeowner stage and intent so messaging feels timely rather than generic." }] },
            { slug: "broadlands", name: "Broadlands", intro: "Broadlands growth depends on consistent neighborhood authority content and event-driven re-engagement.", marketFocus: "Move-up and relocation demand", audience: "Agent + lender growth pods", highlights: ["Local market snapshots", "Relocation drip sequences", "Referral loop automations"], faqs: [{ question: "Do community pages help relocation leads?", answer: "Yes, they set local context quickly and improve trust before a discovery call." }, { question: "Can we repurpose this for social content?", answer: "Each page structure maps directly into weekly social and email content blocks." }] },
            { slug: "belmont-country-club", name: "Belmont Country Club", intro: "Belmont Country Club campaigns require premium positioning and precise conversion journeys.", marketFocus: "Luxury suburban demand", audience: "Luxury-focused operators", highlights: ["Premium offer framing", "High-intent lead capture", "Stakeholder handoff workflows"], faqs: [{ question: "How do you avoid generic luxury copy?", answer: "We use neighborhood-specific proof, buyer profiles, and service differentiators grounded in local demand." }, { question: "Is this architecture scalable to adjacent enclaves?", answer: "Yes, deterministic templates let you scale while preserving local relevance." }] },
            { slug: "one-loudoun", name: "One Loudoun", intro: "One Loudoun pages should emphasize lifestyle proximity and convenience-driven buyer intent.", marketFocus: "Urban-suburban hybrid living", audience: "Modern lifestyle and relocation teams", highlights: ["Lifestyle-first narratives", "Map-based CTA routing", "Short-cycle follow-up"], faqs: [{ question: "What is the best CTA for mixed-use communities?", answer: "Offer neighborhood tours and lifestyle consults, then branch follow-up based on intent signals." }, { question: "Can this tie into CRM tags?", answer: "Yes, each CTA path can trigger segmented tags and smart nurture automations." }] },
          ],
        },
        {
          slug: "leesburg",
          name: "Leesburg",
          blurb: "Leesburg combines historic demand and new growth, making layered local content essential.",
          communities: [
            { slug: "downtown-leesburg", name: "Downtown Leesburg", intro: "Downtown Leesburg pages perform best with walkability-focused storytelling and homeowner education.", marketFocus: "Historic inventory + lifestyle buyers", audience: "Community experts and boutique teams", highlights: ["Local business tie-ins", "Historic-home education", "Event-driven lead capture"], faqs: [{ question: "How should historic-home content be handled?", answer: "Blend compliance-aware educational resources with neighborhood-specific buyer and seller insights." }, { question: "Can this support recurring events marketing?", answer: "Yes, local event modules feed recurring engagement workflows and seasonal campaigns." }] },
            { slug: "lansdowne", name: "Lansdowne", intro: "Lansdowne strategies should align premium amenities with lifecycle-based follow-up.", marketFocus: "Golf and amenity-led communities", audience: "Premium suburban teams", highlights: ["Amenity-focused pages", "Lifecycle nurture tracks", "Performance dashboards"], faqs: [{ question: "What improves lead quality in amenity communities?", answer: "Detailed qualification paths tied to lifestyle priorities and financing readiness." }, { question: "How do you handle long consideration cycles?", answer: "Use adaptive nurture with intent-based cadence adjustments over time." }] },
            { slug: "river-creek", name: "River Creek", intro: "River Creek pages require trust-heavy content and polished conversion pathways for discerning buyers.", marketFocus: "Golf course luxury listings", audience: "Luxury referral networks", highlights: ["Trust architecture", "Private showing workflows", "Referral attribution loops"], faqs: [{ question: "How do referral partners stay aligned?", answer: "Shared dashboards and role-based communication automations keep teams synchronized." }, { question: "What schema matters for these pages?", answer: "LocalBusiness plus Breadcrumb and FAQ schema improve discoverability and rich-result eligibility." }] },
            { slug: "greenway-farm", name: "Greenway Farm", intro: "Greenway Farm demand responds to family-focused narratives and fast listing promotion.", marketFocus: "Family-focused move-up market", audience: "Growth-minded agent teams", highlights: ["Family decision content", "Launch-ready templates", "Post-close retention systems"], faqs: [{ question: "How can small teams scale neighborhood coverage?", answer: "Use reusable structures with deterministic linking so every new page inherits authority pathways." }, { question: "Does this architecture support long-term SEO growth?", answer: "Yes, each page compounds over time through internal links, schema, and quality updates." }] },
          ],
        },
      ],
    },
    {
      slug: "prince-william-county",
      name: "Prince William County",
      positioning:
        "Prince William growth is fueled by affordability-driven migration, making educational neighborhood funnels a strong advantage.",
      cities: [
        {
          slug: "woodbridge",
          name: "Woodbridge",
          blurb: "Woodbridge programs should prioritize buyer education, response speed, and referral continuity.",
          communities: [
            { slug: "lake-ridge", name: "Lake Ridge", intro: "Lake Ridge pages work best with family-centered messaging and confidence-building process content.", marketFocus: "Move-up families and first repeat sellers", audience: "Local listing teams and lender allies", highlights: ["Education-first copy", "Smart lead qualification", "Post-close review campaigns"], faqs: [{ question: "What increases conversion for first repeat sellers?", answer: "Clear timeline guidance, valuation context, and proactive communication automations." }, { question: "How should teams structure CTAs?", answer: "Use staged CTAs: valuation request, strategy consult, then launch readiness." }] },
            { slug: "belmont-bay", name: "Belmont Bay", intro: "Belmont Bay campaigns should connect lifestyle positioning with practical commute and financing content.", marketFocus: "Waterfront and commuter demand", audience: "Mixed-price-point specialists", highlights: ["Lifestyle + commute framing", "Financing education", "Cross-channel launch support"], faqs: [{ question: "Can one template serve diverse price points?", answer: "Yes, with modular proof blocks and intent-based CTA routing." }, { question: "How do we maintain content quality at scale?", answer: "Editorial rules, schema validation, and periodic refresh cycles keep pages sharp." }] },
            { slug: "eagles-pointe", name: "Eagles Pointe", intro: "Eagles Pointe pages should pair practical market guidance with high-frequency nurture touchpoints.", marketFocus: "Value-conscious suburban buyers", audience: "High-volume teams", highlights: ["Quick-start funnels", "Value proposition messaging", "Retention workflows"], faqs: [{ question: "What is the first optimization after launch?", answer: "Review lead routing latency and CTA conversion by source, then refine messaging where drop-off appears." }, { question: "Do these pages help title referral growth?", answer: "Yes, they create consistent branded touchpoints that support partner trust and repeat business." }] },
            { slug: "port-potomac", name: "Port Potomac", intro: "Port Potomac growth comes from reliable local authority and consistent relationship nurture.", marketFocus: "Family move-up and relocation", audience: "Community specialists", highlights: ["Authority hubs", "Relocation onboarding", "Client-lifecycle retention"], faqs: [{ question: "How often should internal links be audited?", answer: "Quarterly audits keep hub-cluster-detail pathways clean and prevent orphan pages." }, { question: "Can these pages drive both buyers and sellers?", answer: "Yes, balanced content and segmented CTAs support dual-intent journeys." }] },
          ],
        },
      ],
    },
  ],
};

export const allLocationPaths = locationSeed.counties.flatMap((county) => [
  `/locations/${county.slug}`,
  ...county.cities.flatMap((city) => [
    `/locations/${county.slug}/${city.slug}`,
    ...city.communities.map((community) => `/locations/${county.slug}/${city.slug}/${community.slug}`),
  ]),
]);

export function findCounty(countySlug: string) {
  return locationSeed.counties.find((county) => county.slug === countySlug);
}

export function findCity(countySlug: string, citySlug: string) {
  return findCounty(countySlug)?.cities.find((city) => city.slug === citySlug);
}

export function findCommunity(countySlug: string, citySlug: string, communitySlug: string) {
  return findCity(countySlug, citySlug)?.communities.find((community) => community.slug === communitySlug);
}
