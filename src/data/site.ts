export type Service = {
  title: string;
  description: string;
  bullets: string[];
  cta?: string;
};

export type EngagementModel = {
  title: string;
  summary: string;
  deliverables: string[];
  timeline: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
};

export type LegalPolicy = {
  title: string;
  body: string;
};

export type SiteContent = {
  company: {
    name: string;
    tagline: string;
    summary: string;
    focusAreas: string[];
    owner: string;
    mission: string;
    email: string;
    phone: string;
    hq: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    stats: { label: string; value: string }[];
  };
  services: Service[];
  engagement: EngagementModel[];
  processSteps: { title: string; description: string }[];
  testimonials: Testimonial[];
  legal: LegalPolicy[];
};

export const fallbackContent: SiteContent = {
  company: {
    name: "Velocity Builders, LLC",
    tagline: "The Title Rep Who Helps You Scale",
    summary:
      "Velocity Builders designs the systems agents, lenders, builders, and banks need to convert listings into lifetime clients. From IDX websites to post-close nurture automation, everything is wired for measurable ROI.",
    focusAreas: [
      "CRM automation",
      "IDX-enabled agent websites",
      "Listing launch marketing",
      "Past client nurture",
      "Co-branded campaigns",
    ],
    owner: "Will Rapuano",
    mission:
      "Give every partner the leverage of a full-stack marketing team without the overhead, so their title, lending, and brokerage deals stay sticky.",
    email: "hello@velocitybuilders.io",
    phone: "(703) 555-0145",
    hq: "Vienna, Virginia",
  },
  hero: {
    eyebrow: "Velocity Builders LLC",
    title: "Operational firepower for every deal you touch",
    subtitle:
      "We architect the marketing, CRM, and nurture systems that keep your pipeline compounding—even when you are at the closing table.",
    primaryCta: "Launch a project",
    secondaryCta: "See services",
    stats: [
      { label: "Automations Deployed", value: "140+" },
      { label: "Listings Powered", value: "320" },
      { label: "Follow-up Touches", value: "1.8M" },
    ],
  },
  services: [
    {
      title: "CRM Automation Sprints",
      description:
        "End-to-end automation builds for GoHighLevel, Follow Up Boss, or Salesforce. Includes pipeline design, scoring logic, alerts, and reporting dashboards.",
      bullets: [
        "Lead routing + agent accountability alerts",
        "Automated post-close + refinance nurture",
        "Service partner co-marketing sequences",
      ],
      cta: "Book an automation audit",
    },
    {
      title: "IDX + Agent Website Program",
      description:
        "Custom-branded, IDX-enabled marketing sites that convert seller and buyer traffic. Built on Next.js with first-class SEO baked in.",
      bullets: [
        "Fast, ADA-ready, mobile-first experience",
        "Real-time listing alerts + saved searches",
        "Sanity CMS for instant content edits",
      ],
      cta: "Request a site build",
    },
    {
      title: "Listing Launch + Content Kits",
      description:
        "Nine-asset content drops for every listing—including social, email, short-form video scripts, and open house funnels.",
      bullets: [
        "Ready-to-post Canva + Reels templates",
        "Geo-targeted lead ads + remarketing",
        "Weekly performance digest",
      ],
      cta: "Spin up a kit",
    },
    {
      title: "Past Client Nurture",
      description:
        "Behavior-triggered mail, SMS, and inbox campaigns that keep your brand in front of homeowners long after the closing table.",
      bullets: [
        "Equity and rate watch automations",
        "Annual home anniversary playbooks",
        "Referral + review capture flows",
      ],
      cta: "Activate nurture",
    },
  ],
  engagement: [
    {
      title: "Launch Intensive",
      summary: "2-week build to stand up a campaign, site, or automation with live training.",
      deliverables: [
        "Discovery workshop + data deep-dive",
        "System architecture + implementation",
        "Activation playbook + enablement call",
      ],
      timeline: "10 business days",
    },
    {
      title: "Managed Growth",
      summary: "Fractional marketing-ops team with monthly sprints, analytics, and optimization.",
      deliverables: [
        "Dedicated roadmap + backlog",
        "Monthly optimization & reporting",
        "Priority support + on-call coverage",
      ],
      timeline: "Quarterly commitments",
    },
    {
      title: "Embedded Partner",
      summary: "For lenders/builders who need Velocity as an embedded marketing pod across regions.",
      deliverables: [
        "Joint KPIs + revenue attribution",
        "Shared Slack + workflow automations",
        "On-site launch weeks + CE co-hosting",
      ],
      timeline: "Custom scope",
    },
  ],
  processSteps: [
    {
      title: "Blueprint",
      description: "We audit your current stack, data, and revenue targets to map the fastest wins.",
    },
    {
      title: "Build",
      description: "Design, copy, automations, and integrations built in focused sprints with stakeholder demos.",
    },
    {
      title: "Launch",
      description: "Done-with-you enablement, QA checklists, and playbooks to keep teams confident.",
    },
    {
      title: "Scale",
      description: "Monthly optimization + reporting so every asset keeps compounding its ROI.",
    },
  ],
  testimonials: [
    {
      quote:
        "Velocity gave our brokerage the marketing muscle we could never hire in-house. Listings go live with full funnel coverage in 48 hours.",
      name: "Amanda Reyes",
      role: "Managing Broker",
      company: "District & Co. Realty",
    },
    {
      quote:
        "Their automation sprints cut our loan officer follow-up time in half. Every lead is touched automatically and escalated when human action is needed.",
      name: "Marcus Ellison",
      role: "Regional Lending Director",
      company: "Potomac Lending Group",
    },
    {
      quote:
        "Post-close nurture now runs on autopilot—mail, SMS, and video messages all stitched together. Repeat business is up 34%.",
      name: "Kelly Martinez",
      role: "Founder",
      company: "Oak & Stone Homes",
    },
  ],
  legal: [
    {
      title: "Refund & Cancellation",
      body:
        "Strategy intensives are refundable (minus payment fees) up to 5 business days before kickoff. Managed engagements require 30-day written notice. Work completed prior to cancellation remains billable.",
    },
    {
      title: "Terms of Service",
      body:
        "Velocity Builders provides marketing technology implementation and advisory services. All intellectual property created during an engagement is transferred upon receipt of final payment. Client data is handled under mutual NDA and never sold.",
    },
    {
      title: "Service Level",
      body:
        "Standard response within 1 business day. Managed Growth and Embedded Partner tiers include priority Slack support and after-hours coverage for live launches.",
    },
  ],
};
