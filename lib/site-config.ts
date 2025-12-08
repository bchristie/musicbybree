/**
 * Central configuration for site metadata
 * Update these values in one place to maintain consistency across the entire application
 */

export const SITE_CONFIG = {
  // Basic Information
  name: "Music by Bree",
  shortName: "Music by Bree",
  title: "Music by Bree",
  description: "Professional vocal performance repertoire and showcase",
  
  // URLs
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://musicbybree.com",
  
  // Artist Information
  artist: {
    name: "Bree",
    fullName: "Bree Christie",
    title: "Vocal Artist",
  },
  
  // Theme Colors
  theme: {
    primary: "#000000",
    background: "#ffffff",
  },
  
  // Social/Contact (add as needed)
  contact: {
    // email: "booking@musicbybree.com",
    // phone: "+1-555-555-5555",
  },
  
  // PWA Configuration
  pwa: {
    orientation: "portrait-primary" as const,
    display: "standalone" as const,
  },
} as const;

// Derived values for convenience
export const SITE_TITLE = SITE_CONFIG.title;
export const SITE_NAME = SITE_CONFIG.name;
export const SITE_DESCRIPTION = SITE_CONFIG.description;
export const SITE_URL = SITE_CONFIG.url;
