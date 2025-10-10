
import { container } from '@/lib/dependency-container';
import { bootstrapUserModule } from '@/modules/users/factories/user.bootstrap';
import { bootstrapClientModule } from '@/modules/clients/factories/client.bootstrap';
import { bootstrapSchedulingModule } from '@/modules/scheduling/factories/scheduling.bootstrap';
import { bootstrapSettingModule } from '@/modules/settings/factories/setting.bootstrap';
import { bootstrapChatbotModule } from '@/modules/chatbot/factories/chatbot.bootstrap';
import { bootstrapHeroSectionModule } from '@/modules/hero/factories/hero-section.bootstrap';
import { bootstrapFeatureModule } from '@/modules/features/factories/feature.bootstrap';
import { bootstrapTestimonialModule } from '@/modules/testimonials/factories/testimonial.bootstrap';
import { bootstrapFaqModule } from '@/modules/faq/factories/faq.bootstrap';
import { bootstrapContactModule } from '@/modules/contact/factories/contact.bootstrap';
import { bootstrapContactSectionModule } from '@/modules/contact-section/factories/contact-section.bootstrap';
import { bootstrapAppointmentsSectionModule } from '@/modules/appointments-section/factories/appointments-section.bootstrap';
import { bootstrapFooterSectionModule } from '@/modules/footer-section/factories/footer-section.bootstrap';
import { bootstrapNavbarSectionModule } from '@/modules/navbar-section/factories/navbar-section.bootstrap';
import { bootstrapSecurityModule } from '@/modules/security/factories/security.bootstrap';
import { bootstrapEmailModule } from '@/modules/email/factories/email.bootstrap';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { bootstrapEmailTemplateModule } from '@/modules/email-templates/factories/email-template.bootstrap';
import { bootstrapIntegrationsModule } from '@/modules/integrations/factories/integrations.bootstrap';
import { bootstrapAnalyticsModule } from '@/modules/analytics/factories/analytics.bootstrap';
import { bootstrapServiceModule } from '@/modules/services/factories/service.bootstrap';
import { bootstrapServicesSectionModule } from '@/modules/services-section/factories/services-section.bootstrap';
import { bootstrapLocationModule } from '@/modules/locations/factories/location.bootstrap';

let servicesInitialized = false;

export function initializeServices(): void {
  if (servicesInitialized) {
    return;
  }
  
  bootstrapUserModule();
  bootstrapClientModule();
  bootstrapEmailModule();
  bootstrapEmailTemplateModule();
  bootstrapSchedulingModule();
  bootstrapSettingModule();
  bootstrapChatbotModule();
  bootstrapHeroSectionModule();
  bootstrapFeatureModule();
  bootstrapTestimonialModule();
  bootstrapFaqModule();
  bootstrapContactModule();
  bootstrapAppointmentsSectionModule();
  bootstrapFooterSectionModule();
  bootstrapNavbarSectionModule();
  bootstrapContactSectionModule();
  bootstrapSecurityModule();
  bootstrapIntegrationsModule();
  bootstrapAnalyticsModule();
  bootstrapServiceModule();
  bootstrapServicesSectionModule();
  bootstrapLocationModule();

  servicesInitialized = true;
}

// Optional: A resolve function for convenience, though direct container usage is also fine.
export function resolve<T>(key: string): T {
  // Ensure services are initialized, especially important for serverless environments
  if (!servicesInitialized) {
    initializeServices();
  }
  return container.resolve<T>(key);
}
