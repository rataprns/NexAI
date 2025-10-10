"use client";

import { useQuery } from "@tanstack/react-query";

const fetchLandingPageData = async () => {
    const res = await fetch('/api/landing-page');
    if (!res.ok) {
        throw new Error('Failed to fetch landing page data');
    }
    return res.json();
}

export function useLandingPage() {
    return useQuery({
        queryKey: ['landingPageData'],
        queryFn: fetchLandingPageData,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
