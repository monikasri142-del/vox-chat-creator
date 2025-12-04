import { useEffect, useRef } from 'react';
import { ChatMessage, Message } from './ChatMessage';
import { MessageCircle } from 'lucide-react';

interface ChatContainerProps {
  messages: Message[];
}

export const ChatContainer = ({ messages }: ChatContainerProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 rounded-full bg-secondary border border-border flex items-center justify-center mb-6 animate-float">
          <MessageCircle className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Start a Conversation
        </h2>
        <p className="text-muted-foreground max-w-sm">
          Tap the microphone button below and speak. I'll listen and respond to your questions.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
