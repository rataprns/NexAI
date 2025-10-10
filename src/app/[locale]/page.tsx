'use client';

import { HeroSection } from "@/components/landing/hero-section";
import { Features } from "@/components/landing/features";
import { Contact } from "@/components/landing/contact";
import { Testimonials } from "@/components/landing/testimonials";
import { Faq } from "@/components/landing/faq";
import { Appointments } from "@/components/landing/appointments";
import { Services } from "@/components/landing/services";
import { useLandingPage } from "./_hooks/useLandingPage";
import { Skeleton } from "@/components/ui/skeleton";

const sectionComponents: { [key: string]: React.FC<any> } = {
  heroSection: HeroSection,
  features: Features,
  services: Services,
  testimonials: Testimonials,
  faq: Faq,
  contact: Contact,
  appointments: Appointments,
};

const SectionSkeleton = () => (
  <div className="container mx-auto py-20">
    <Skeleton className="h-8 w-1/4 mb-4" />
    <Skeleton className="h-12 w-1/2 mb-8" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  </div>
);


export default function HomePage() {
  const { data, isLoading, isError } = useLandingPage();

  if (isLoading) {
    return (
      <>
        <SectionSkeleton />
        <SectionSkeleton />
      </>
    );
  }

  if (isError || !data) {
    return <div className="text-center py-20">Failed to load page content. Please try again later.</div>;
  }

  const {
    settings,
    heroSection,
    features,
    testimonials,
    faq,
    appointmentsSection,
    contactSection,
    services,
    servicesSection,
    locations,
  } = data;
  
  const allData: { [key: string]: any } = {
    heroSection: { settings, heroSection },
    features: { features },
    services: { services, servicesSection, locations },
    testimonials: { testimonials },
    faq: { faq },
    contact: { settings, contactSection },
    appointments: { settings, appointmentsSection, locations },
  };

  const sectionVisibility: { [key:string]: boolean | undefined } = {
    heroSection: true, // Hero is always visible
    features: settings?.landingPage?.showFeatures,
    services: settings?.landingPage?.showServices,
    testimonials: settings?.landingPage?.showTestimonials,
    faq: settings?.landingPage?.showFaq,
    contact: settings?.landingPage?.showContact,
    appointments: settings?.landingPage?.showAppointments,
  };

  const orderedSections = settings?.landingPage?.sectionOrder || [];

  const visibleSections = orderedSections.filter((sectionId:any) => sectionVisibility[sectionId as keyof typeof sectionVisibility]);

  return (
    <>
      {visibleSections.map((sectionId:any) => {
        const Component = sectionComponents[sectionId];
        if (Component) {
          return <Component key={sectionId} {...allData[sectionId]} />;
        }
        return null;
      })}
    </>
  );
}
