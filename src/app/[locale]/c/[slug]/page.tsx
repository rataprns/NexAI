

'use client';

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { PublicAppointmentForm } from "@/components/landing/public-appointment-form";
import ReactMarkdown from "react-markdown";

const fetchCampaignData = async (slug: string) => {
    const res = await fetch(`/api/campaigns?slug=${slug}`);
    if (!res.ok) {
        throw new Error('Campaign not found');
    }
    return res.json();
};

const CampaignPageSkeleton = () => (
  <div className="container mx-auto py-20 px-4 md:px-6">
    <div className="flex flex-col items-center text-center space-y-4">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-6 w-1/2" />
      <div className="space-y-2 max-w-2xl">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  </div>
);

export default function CampaignPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const { data: campaign, isLoading, isError } = useQuery({
      queryKey: ['campaign', slug],
      queryFn: () => fetchCampaignData(slug),
      enabled: !!slug, // Only run query when slug is available
      retry: false,
  });

  const { data: landingPageData } = useQuery({
    queryKey: ['landingPageData'],
    queryFn: () => fetch('/api/landing-page').then(res => res.json())
  });


  if (isLoading || !landingPageData) {
    return <CampaignPageSkeleton />;
  }

  if (isError || !campaign) {
    return (
      <div className="container mx-auto py-40 text-center">
        <h1 className="text-4xl font-bold">404 - Not Found</h1>
        <p className="text-muted-foreground mt-4">The campaign page you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <section className="w-full py-20 md:py-32 lg:py-40 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24 items-center">
            <div className="flex flex-col justify-center space-y-6">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                    {campaign.generatedTitle}
                </h1>
                <div className="prose max-w-[600px] text-muted-foreground md:text-xl/relaxed dark:prose-invert">
                    <ReactMarkdown>{campaign.generatedSubtitle}</ReactMarkdown>
                </div>
                <div className="prose text-muted-foreground dark:prose-invert">
                    <ReactMarkdown>{campaign.generatedBody}</ReactMarkdown>
                </div>
            </div>
             <div className="w-full max-w-xl mx-auto">
                <PublicAppointmentForm locations={landingPageData.locations} settings={landingPageData.settings} />
            </div>
        </div>
      </div>
    </section>
  );
}
