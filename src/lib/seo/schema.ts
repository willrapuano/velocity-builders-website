const siteUrl = "https://velocity-builders.com";

export type Crumb = {
  name: string;
  path: string;
};

export function buildCanonical(path: string) {
  return `${siteUrl}${path}`;
}

export function professionalServiceSchema(input: {
  name?: string;
  description: string;
  areaServed?: string;
  path?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: input.name ?? "Velocity Builders, LLC",
    url: buildCanonical(input.path ?? "/"),
    description: input.description,
    telephone: "(703) 859-1467",
    email: "hello@velocity-builders.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Vienna",
      addressRegion: "VA",
      addressCountry: "US",
    },
    areaServed: input.areaServed ?? "DC, Maryland, and Virginia",
  };
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: buildCanonical(crumb.path),
    })),
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function articleSchema(input: {
  headline: string;
  description: string;
  path: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    author: {
      "@type": "Organization",
      name: "Velocity Builders, LLC",
    },
    publisher: {
      "@type": "Organization",
      name: "Velocity Builders, LLC",
    },
    mainEntityOfPage: buildCanonical(input.path),
    dateModified: input.dateModified ?? new Date().toISOString(),
  };
}
