"use client";

import dynamic from 'next/dynamic';

// Dynamically import the ChatbotWidget and disable Server-Side Rendering (SSR)
// This ensures the component only renders on the client, avoiding hydration errors.
export const DynamicChatbotWidget = dynamic(
  () => import('@/components/chatbot-widget').then((mod) => mod.ChatbotWidget),
  { ssr: false }
);
