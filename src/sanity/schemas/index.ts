import { post } from "./post";
import { siteSettings } from "./siteSettings";
import { homepage } from "./homepage";
import { service } from "./service";
import { about } from "./about";
import { testimonial } from "./testimonial";
import { caseStudy } from "./caseStudy";

export const schemaTypes = [
  // Singletons
  siteSettings,
  homepage,
  about,
  // Collections
  post,
  service,
  testimonial,
  caseStudy,
];
