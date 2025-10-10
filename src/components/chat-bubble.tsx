import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

interface ChatBubbleProps {
  message: {
    role: "user" | "bot";
    text: string;
  };
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex items-start gap-3", isUser ? "justify-end" : "w-full")}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[75%] rounded-lg p-3 text-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted flex-1"
        )}
      >
        <p>{message.text}</p>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
