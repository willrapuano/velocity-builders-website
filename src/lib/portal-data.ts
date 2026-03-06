export type StatusTone = "healthy" | "watch" | "action";

export type DashboardStat = {
  label: string;
  value: string;
  delta: string;
  tone: StatusTone;
  context: string;
};

export type TrendPoint = {
  label: string;
  value: number;
};

export type GoogleMetric = {
  label: string;
  value: string;
  trend: string;
  tone: StatusTone;
};

export type OptimizationItem = {
  area: string;
  completion: number;
  status: "Complete" | "In progress" | "Needs review";
  updatedAt: string;
};

export type ThanksSummary = {
  mailingsSent: string;
  scansRecorded: string;
  deliveriesConfirmed: string;
  responseRate: string;
  averageScanToLeadHours: string;
};

export type ThanksMonthly = {
  month: string;
  mailings: number;
  scans: number;
  deliveries: number;
  quality: "Strong" | "Stable" | "Monitor";
};

export type DatabaseSnapshot = {
  pipelineCoverage: string;
  recordsProcessed: string;
  addressVerificationRate: string;
  audienceReadyRate: string;
  automationHealth: "Healthy" | "Watch";
  syncLatency: string;
};

export type DataSegment = {
  segment: string;
  volume: string;
  share: string;
  readiness: "Ready" | "QA" | "Queued";
};

export type PortalData = {
  lastUpdated: string;
  privacyNotice: string;
  overallStats: DashboardStat[];
  leadTrend: TrendPoint[];
  google: {
    profileHealthScore: string;
    visibilityTrend: string;
    metrics: GoogleMetric[];
    optimizationChecklist: OptimizationItem[];
  };
  thanks: {
    summary: ThanksSummary;
    monthlyPerformance: ThanksMonthly[];
  };
  databaseRecreator: {
    snapshot: DatabaseSnapshot;
    segments: DataSegment[];
  };
};

export const portalData: PortalData = {
  lastUpdated: "March 5, 2026, 5:48 PM ET",
  privacyNotice:
    "Client-level records, names, addresses, and other PII are intentionally excluded. This portal shows anonymized, aggregated performance only.",
  overallStats: [
    {
      label: "Active Realtor Accounts",
      value: "42",
      delta: "+6 MoM",
      tone: "healthy",
      context: "Accounts with at least one active campaign this month",
    },
    {
      label: "Campaigns Running",
      value: "118",
      delta: "+14%",
      tone: "healthy",
      context: "Combined Google, mail, and nurture workflows",
    },
    {
      label: "Pipeline Influence",
      value: "$2.7M",
      delta: "+9.2%",
      tone: "healthy",
      context: "Estimated transaction volume influenced by current programs",
    },
    {
      label: "Attention Needed",
      value: "7",
      delta: "2 overdue",
      tone: "watch",
      context: "Items flagged for optimization or QA follow-up",
    },
  ],
  leadTrend: [
    { label: "Oct", value: 42 },
    { label: "Nov", value: 48 },
    { label: "Dec", value: 45 },
    { label: "Jan", value: 57 },
    { label: "Feb", value: 63 },
    { label: "Mar", value: 68 },
  ],
  google: {
    profileHealthScore: "91/100",
    visibilityTrend: "+12% quarter-over-quarter local visibility",
    metrics: [
      { label: "Profile Completeness", value: "96%", trend: "+4%", tone: "healthy" },
      { label: "Review Velocity", value: "18/mo", trend: "+2/mo", tone: "healthy" },
      { label: "Map Pack Presence", value: "74%", trend: "+7%", tone: "healthy" },
      { label: "Photo Freshness", value: "63%", trend: "-5%", tone: "watch" },
    ],
    optimizationChecklist: [
      { area: "Primary service categories", completion: 100, status: "Complete", updatedAt: "2 days ago" },
      { area: "Weekly post cadence", completion: 82, status: "In progress", updatedAt: "1 day ago" },
      { area: "Q&A moderation", completion: 76, status: "In progress", updatedAt: "3 days ago" },
      { area: "Media refresh rotation", completion: 58, status: "Needs review", updatedAt: "5 days ago" },
    ],
  },
  thanks: {
    summary: {
      mailingsSent: "8,420",
      scansRecorded: "1,188",
      deliveriesConfirmed: "8,109",
      responseRate: "14.1%",
      averageScanToLeadHours: "9.4h",
    },
    monthlyPerformance: [
      { month: "Dec", mailings: 1220, scans: 166, deliveries: 1176, quality: "Stable" },
      { month: "Jan", mailings: 1360, scans: 189, deliveries: 1314, quality: "Strong" },
      { month: "Feb", mailings: 1480, scans: 213, deliveries: 1426, quality: "Strong" },
      { month: "Mar", mailings: 1610, scans: 237, deliveries: 1552, quality: "Strong" },
    ],
  },
  databaseRecreator: {
    snapshot: {
      pipelineCoverage: "89%",
      recordsProcessed: "24,600",
      addressVerificationRate: "92.4%",
      audienceReadyRate: "78%",
      automationHealth: "Healthy",
      syncLatency: "~22 min",
    },
    segments: [
      { segment: "Likely still-in-home", volume: "9,840", share: "40%", readiness: "Ready" },
      { segment: "Likely moved", volume: "6,510", share: "26%", readiness: "Ready" },
      { segment: "Manual verification queue", volume: "3,780", share: "15%", readiness: "QA" },
      { segment: "New ingestion batch", volume: "4,470", share: "18%", readiness: "Queued" },
    ],
  },
};
