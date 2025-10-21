"use client";

import dynamic from 'next/dynamic';

export const DynamicChatbotWidget = dynamic(
  () => import('@/components/chatbot-widget').then((mod) => mod.ChatbotWidget),
  { 
    ssr: false,
  }
);
