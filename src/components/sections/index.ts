// Section Renderer Registry
// Each section can have its own semantic parser and renderer

import { Section } from '@/content/sections';
import { HeroSection } from './HeroSection';
import { PromiseSection } from './PromiseSection';
import { ProofSection } from './ProofSection';
import { SpectrumSection } from './SpectrumSection';
import { AttitudeSection } from './AttitudeSection';
import { CurrentSection } from './CurrentSection';
import { GoalsSection } from './GoalsSection';
import { ContactSection } from './ContactSection';
import { DefaultSection } from './DefaultSection';

// Section type to renderer mapping (keys match file slugs from content/sections/)
const sectionRenderers: Record<string, React.ComponentType<{ section: Section }>> = {
  '01-hero': HeroSection,
  '02-versprechen': PromiseSection,
  '03-beweis': ProofSection,
  '04-spektrum': SpectrumSection,
  '05-haltung': AttitudeSection,
  '06-aktuell': CurrentSection,
  '07-ziele-2026': GoalsSection,
  '08-kontakt': ContactSection,
};

export function getSectionRenderer(slug: string): React.ComponentType<{ section: Section }> {
  return sectionRenderers[slug] || DefaultSection;
}

export { HeroSection, PromiseSection, ProofSection, SpectrumSection, AttitudeSection, CurrentSection, GoalsSection, ContactSection, DefaultSection };

