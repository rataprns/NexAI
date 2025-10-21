
"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, X, Loader2 } from "lucide-react";
import { ChatBubble } from "./chat-bubble";
import { cn } from "@/lib/utils";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";

type Message = {
  role: "user" | "bot";
  text: string;
};

interface ChatbotWidgetProps {
  appName: string;
  initialMessage: string;
}

export function ChatbotWidget({ appName, initialMessage }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [senderId, setSenderId] = useState<string>('');

  const t = useScopedI18n("chatbot");
  const locale = useCurrentLocale();
  const pathname = usePathname();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    let storedSenderId = localStorage.getItem('chatbot_sender_id');
    if (!storedSenderId) {
      const randomPart = Math.random().toString(36).substring(2, 9);
      storedSenderId = `web-session-${Date.now()}-${randomPart}`;
      localStorage.setItem('chatbot_sender_id', storedSenderId);
    }
    setSenderId(storedSenderId);

    const initializeChat = async (id: string) => {
      try {
        const response = await fetch(`/api/chatbot/history?senderId=${id}`);
        if (response.ok) {
            const history = await response.json();
            if (history && history.length > 0) {
                setMessages(history);
            } else {
                 setMessages([{ role: "bot", text: initialMessage }]);
            }
        } else {
             setMessages([{ role: "bot", text: initialMessage }]);
        }
      } catch (error) {
          console.error("Failed to fetch chat history", error);
          setMessages([{ role: "bot", text: initialMessage }]);
      }
    };

    if (storedSenderId) {
        initializeChat(storedSenderId);
    }
  }, [initialMessage]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !senderId) return;

    const userMessage: Message = { role: "user", text: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    const textToSend = input;
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: textToSend, 
          history: newMessages, // Use the most up-to-date message list
          flowName: 'chatbotAnswerQuestions',
          language: locale,
          sessionId: senderId, 
          pathname: pathname,
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      const botMessage: Message = { role: "bot", text: data.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error("Chatbot API Error:", error);
      const errorMessage: Message = { role: "bot", text: "Sorry, I'm having trouble connecting. Please try again later." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!appName) return null;

  return (
    <>
      <div className={cn("fixed bottom-4 right-4 z-50 transition-transform duration-300 ease-in-out", isOpen ? "translate-x-[calc(100%+2rem)]" : "translate-x-0")}>
        <Button size="icon" className="rounded-full w-14 h-14" onClick={() => setIsOpen(true)}>
          <Bot className="h-7 w-7" />
          <span className="sr-only">Open Chat</span>
        </Button>
      </div>

      <div className={cn("fixed bottom-4 right-4 z-50 w-full max-w-sm transition-transform duration-300 ease-in-out", isOpen ? "translate-x-0" : "translate-x-[calc(100%+2rem)]")}>
        <Card className="flex flex-col h-[60vh] shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6" /> {appName} Assistant
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close Chat</span>
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <ChatBubble key={index} message={message} />
                ))}
                 {isLoading && (
                    <div className="flex items-center gap-2 pt-2">
                      <div className="bg-primary text-primary-foreground rounded-full p-1.5">
                        <Bot className="h-5 w-5" />
                      </div>
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                )}
                <div ref={scrollAreaRef} />
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
              <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('input-placeholder')}
                  disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">{t('send-button')}</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
