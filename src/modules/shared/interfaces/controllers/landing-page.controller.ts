
import { NextRequest, NextResponse } from 'next/server';
import { resolve } from '@/services/bootstrap';
import { ISettingService } from '@/modules/settings/domain/services/setting.service.interface';
import { IHeroSectionService } from '@/modules/hero/domain/services/hero-section.service.interface';
import { IFeatureService } from '@/modules/features/domain/services/feature.service.interface';
import { ITestimonialService } from '@/modules/testimonials/domain/services/testimonial.service.interface';
import { IFaqService } from '@/modules/faq/domain/services/faq.service.interface';
import { IAppointmentsSectionService } from '@/modules/appointments-section/domain/services/appointments-section.service.interface';
import { IContactSectionService } from '@/modules/contact-section/domain/services/contact-section.service.interface';
import { IServiceService } from '@/modules/services/domain/services/service.service.interface';
import { IServicesSectionService } from '@/modules/services-section/domain/services/services-section.service.interface';
import { ILocationService } from '@/modules/locations/domain/services/location.service.interface';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import defaultSettings from '@/lib/default-settings.json';

const getSettingService = () => resolve<ISettingService>(SERVICE_KEYS.SettingService);
const getHeroSectionService = () => resolve<IHeroSectionService>(SERVICE_KEYS.HeroSectionService);
const getFeatureService = () => resolve<IFeatureService>(SERVICE_KEYS.FeatureService);
const getTestimonialService = () => resolve<ITestimonialService>(SERVICE_KEYS.TestimonialService);
const getFaqService = () => resolve<IFaqService>(SERVICE_KEYS.FaqService);
const getAppointmentsSectionService = () => resolve<IAppointmentsSectionService>(SERVICE_KEYS.AppointmentsSectionService);
const getContactSectionService = () => resolve<IContactSectionService>(SERVICE_KEYS.ContactSectionService);
const getServiceService = () => resolve<IServiceService>(SERVICE_KEYS.ServiceService);
const getServicesSectionService = () => resolve<IServicesSectionService>(SERVICE_KEYS.ServicesSectionService);
const getLocationService = () => resolve<ILocationService>(SERVICE_KEYS.LocationService);

async function getLandingPageData(req: NextRequest) {
    try {
        const [
            settingsData,
            heroSectionData,
            featuresData,
            testimonialsData,
            faqData,
            appointmentsSectionData,
            contactSectionData,
            servicesData,
            servicesSectionData,
            locationsData,
        ] = await Promise.all([
            getSettingService().getSettings(),
            getHeroSectionService().getHeroSection(),
            getFeatureService().getFeatures(),
            getTestimonialService().getTestimonials(),
            getFaqService().getFaq(),
            getAppointmentsSectionService().getAppointmentsSection(),
            getContactSectionService().getContactSection(),
            getServiceService().findAllActiveServices(),
            getServicesSectionService().getServicesSection(),
            getLocationService().findAllActiveLocations(),
        ]);

        // IMPORTANT: Sanitize settings before sending to client to avoid exposing secrets.
        const sanitizedSettings = settingsData ? (({ integrations, ...rest }) => rest)(JSON.parse(JSON.stringify(settingsData))) : null;

        // Convert class instances to plain objects for Client Components
        const data = {
            settings: sanitizedSettings,
            heroSection: heroSectionData ? JSON.parse(JSON.stringify(heroSectionData)) : null,
            features: featuresData ? JSON.parse(JSON.stringify(featuresData)) : null,
            testimonials: testimonialsData ? JSON.parse(JSON.stringify(testimonialsData)) : null,
            faq: faqData ? JSON.parse(JSON.stringify(faqData)) : null,
            appointmentsSection: appointmentsSectionData ? JSON.parse(JSON.stringify(appointmentsSectionData)) : null,
            contactSection: contactSectionData ? JSON.parse(JSON.stringify(contactSectionData)) : null,
            services: servicesData ? JSON.parse(JSON.stringify(servicesData)) : [],
            servicesSection: servicesSectionData ? JSON.parse(JSON.stringify(servicesSectionData)) : null,
            locations: locationsData ? JSON.parse(JSON.stringify(locationsData)) : [],
        };

        const appName = data.settings?.appName || defaultSettings.appName;

        // Replace placeholders on the server
        if (data.heroSection) {
            data.heroSection.subtitle = data.heroSection.subtitle.replace('{appName}', appName);
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[LANDING_PAGE_API_ERROR]", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export const landingPageController = {
    getLandingPageData
};
