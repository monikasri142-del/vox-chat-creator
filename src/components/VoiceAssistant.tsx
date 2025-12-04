import { useState, useEffect, useCallback } from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { VoiceButton } from './VoiceButton';
import { ChatContainer } from './ChatContainer';
import { Message } from './ChatMessage';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, AlertCircle } from 'lucide-react';

// Simple AI responses - in a real app, this would connect to an AI API
const generateResponse = (input: string): string => {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
    return "Hello! I'm your AI voice assistant. How can I help you today?";
  }
  if (lowerInput.includes('how are you')) {
    return "I'm doing great, thank you for asking! I'm here and ready to assist you with anything you need.";
  }
  if (lowerInput.includes('weather')) {
    return "I don't have access to real-time weather data, but I'd recommend checking a weather app or website for the most accurate forecast in your area.";
  }
  if (lowerInput.includes('time')) {
    return `The current time is ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;
  }
  if (lowerInput.includes('name')) {
    return "I'm Nova, your AI voice assistant. I'm here to help answer your questions and have conversations with you.";
  }
  if (lowerInput.includes('thank')) {
    return "You're welcome! Is there anything else I can help you with?";
  }
  if (lowerInput.includes('bye') || lowerInput.includes('goodbye')) {
    return "Goodbye! It was nice chatting with you. Feel free to come back anytime!";
  }
  if (lowerInput.includes('joke')) {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "What do you call a fake noodle? An impasta!",
      "Why did the scarecrow win an award? He was outstanding in his field!",
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }
  
  return "That's an interesting question! While I'm a demo assistant with limited capabilities, I'm designed to show how voice interactions work. In a full implementation, I would connect to an AI service to provide more comprehensive responses.";
};

export const VoiceAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();
  
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported: speechRecognitionSupported,
    error: recognitionError,
  } = useSpeechRecognition();

  const {
    speak,
    isSpeaking,
    isSupported: speechSynthesisSupported,
  } = useSpeechSynthesis();

  const handleVoiceButtonClick = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Handle transcript when speech recognition completes
  useEffect(() => {
    if (transcript && !isListening) {
      // Add user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: transcript,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Generate and add AI response
      setTimeout(() => {
        const response = generateResponse(transcript);
        const aiMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        
        // Speak the response
        if (speechSynthesisSupported) {
          speak(response);
        }
      }, 500);
    }
  }, [transcript, isListening, speak, speechSynthesisSupported]);

  // Handle recognition errors
  useEffect(() => {
    if (recognitionError) {
      toast({
        title: "Speech Recognition Error",
        description: recognitionError === 'no-speech' 
          ? "No speech was detected. Please try again."
          : `Error: ${recognitionError}`,
        variant: "destructive",
      });
    }
  }, [recognitionError, toast]);

  if (!speechRecognitionSupported) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="glass p-8 rounded-2xl max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Browser Not Supported
          </h2>
          <p className="text-muted-foreground">
            Your browser doesn't support the Web Speech API. Please try using Chrome, Edge, or Safari for the best experience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background gradient effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 80%, hsl(180 70% 50% / 0.08) 0%, transparent 50%)',
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-center gap-2 py-6 border-b border-border/50">
        <Sparkles className="w-6 h-6 text-primary" />
        <h1 className="text-xl font-semibold text-foreground">Nova AI</h1>
      </header>

      {/* Chat area */}
      <ChatContainer messages={messages} />

      {/* Voice button area */}
      <div className="relative z-10 flex flex-col items-center justify-center py-8 pb-12">
        <VoiceButton
          isListening={isListening}
          isSpeaking={isSpeaking}
          onClick={handleVoiceButtonClick}
        />
      </div>
    </div>
  );
};
