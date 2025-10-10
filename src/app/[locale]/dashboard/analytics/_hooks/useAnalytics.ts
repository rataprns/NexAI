
"use client";

import { useQuery } from "@tanstack/react-query";

const fetchIntentData = async () => {
    const res = await fetch('/api/analytics/intents');
    if (!res.ok) {
        throw new Error('Failed to fetch intent analytics');
    }
    return res.json();
};

const fetchSentimentData = async () => {
    const res = await fetch('/api/analytics/sentiments');
    if (!res.ok) {
        throw new Error('Failed to fetch sentiment analytics');
    }
    return res.json();
};

const fetchToolPerformanceData = async () => {
    const res = await fetch('/api/analytics/tool-performance');
    if (!res.ok) {
        throw new Error('Failed to fetch tool performance analytics');
    }
    return res.json();
};

export function useIntentAnalytics() {
    return useQuery({
        queryKey: ['intentAnalytics'],
        queryFn: fetchIntentData
    });
}

export function useSentimentAnalytics() {
    return useQuery({
        queryKey: ['sentimentAnalytics'],
        queryFn: fetchSentimentData
    });
}

export function useToolPerformanceAnalytics() {
    return useQuery({
        queryKey: ['toolPerformanceAnalytics'],
        queryFn: fetchToolPerformanceData
    });
}
