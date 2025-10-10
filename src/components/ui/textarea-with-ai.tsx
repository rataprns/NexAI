
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2, Sparkles, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea, type TextareaProps } from "@/components/ui/textarea";
import { Input } from "./input";
import { Button } from "./button";

async function callAIFlow(flowName: 'improveText', payload: any) {
  const response = await fetch('/api/chatbot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ flowName, ...payload }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Failed to run ${flowName}`);
  }
  return response.json();
}

const TextareaWithAI = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement>(null);
    React.useImperativeHandle(ref, () => internalRef.current!, []);
    const popoverRef = React.useRef<HTMLDivElement>(null);

    const [popoverOpen, setPopoverOpen] = React.useState(false);
    const [position, setPosition] = React.useState({ top: 0, left: 0 });
    const [customPrompt, setCustomPrompt] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [AIText, setAIText] = React.useState<string | null>(null);
    const [selection, setSelection] = React.useState<{ start: number, end: number } | null>(null);
    const { toast } = useToast();

    const handleMouseUp = (event: React.MouseEvent<HTMLTextAreaElement>) => {
      const textarea = internalRef.current;
      if (!textarea) return;

      const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);

      if (selectedText.trim().length > 0) {
        setSelection({ start: textarea.selectionStart, end: textarea.selectionEnd });
        
        const popoverHeight = 120; // Estimated height of the popover
        const top = event.clientY - popoverHeight;
        const left = event.clientX;

        setPosition({ top, left });
        setAIText(null);
        setCustomPrompt("");
        setPopoverOpen(true);
      } else {
        setPopoverOpen(false);
      }
    };
    
    const handleImprove = async () => {
      if (!selection) return;

      const textToImprove = (value as string).substring(selection.start, selection.end);
      setIsLoading(true);
      setAIText(null);

      try {
        const result = await callAIFlow('improveText', { text: textToImprove, prompt: customPrompt || "Substantially improve this text" });
        setAIText(result.improvedText);
      } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        setPopoverOpen(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    const handleAccept = () => {
      if (!selection || AIText === null) return;
      
      const currentValue = value as string;
      const newValue = 
        currentValue.substring(0, selection.start) + 
        AIText + 
        currentValue.substring(selection.end);
      
      const syntheticEvent = {
        target: { value: newValue },
      } as React.ChangeEvent<HTMLTextAreaElement>;
      
      onChange?.(syntheticEvent);
      
      setPopoverOpen(false);
    };

    const handleRetry = () => {
        setAIText(null);
        setCustomPrompt("");
    };

    const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
        if (popoverRef.current && !popoverRef.current.contains(event.relatedTarget as Node)) {
            setPopoverOpen(false);
        }
    };

    return (
      <div className="relative">
        <Textarea
          ref={internalRef}
          className={cn("w-full", className)}
          onMouseUp={handleMouseUp}
          onBlur={handleBlur}
          onScroll={() => setPopoverOpen(false)}
          value={value}
          onChange={onChange}
          {...props}
        />
        {popoverOpen && (
          <div
            ref={popoverRef}
            tabIndex={-1}
            className="fixed z-50"
            style={{ top: `${position.top}px`, left: `${position.left}px` }}
          >
            <div className="bg-background border rounded-lg shadow-lg p-2 flex flex-col gap-2 min-w-[250px]">
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : AIText !== null ? (
                <>
                  <p className="text-sm p-2 bg-muted rounded-md max-h-40 overflow-y-auto">{AIText}</p>
                   <div className="flex gap-2">
                    <Button size="sm" onClick={handleAccept} className="w-full">
                        <Check className="mr-2 h-4 w-4" /> Accept
                    </Button>
                     <Button size="sm" variant="ghost" onClick={handleRetry} className="w-full">
                        <X className="mr-2 h-4 w-4" /> Retry
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Input
                    placeholder="E.g., Make this more professional"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="h-8 text-sm"
                  />
                  <Button size="sm" onClick={handleImprove} className="w-full">
                      <Sparkles className="mr-2 h-4 w-4" /> Improve
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);
TextareaWithAI.displayName = "TextareaWithAI";

export { TextareaWithAI };
