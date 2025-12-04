import { Mic, MicOff, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceButtonProps {
  isListening: boolean;
  isSpeaking: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const VoiceButton = ({ isListening, isSpeaking, onClick, disabled }: VoiceButtonProps) => {
  return (
    <div className="relative">
      {/* Pulse rings when active */}
      {isListening && (
        <>
          <div className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
        </>
      )}
      
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300",
          "border-2",
          isListening 
            ? "bg-primary border-primary glow scale-110" 
            : isSpeaking
              ? "bg-secondary border-primary/50 glow-sm"
              : "bg-secondary border-border hover:border-primary/50 hover:glow-sm",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
        aria-label={isListening ? "Stop listening" : "Start listening"}
      >
        {isSpeaking ? (
          <Volume2 className="w-8 h-8 text-primary animate-pulse" />
        ) : isListening ? (
          <Mic className="w-8 h-8 text-primary-foreground" />
        ) : (
          <MicOff className="w-8 h-8 text-muted-foreground" />
        )}
      </button>

      {/* Status text */}
      <p className={cn(
        "absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-medium whitespace-nowrap transition-all duration-300",
        isListening ? "text-primary text-glow" : isSpeaking ? "text-primary/80" : "text-muted-foreground"
      )}>
        {isSpeaking ? "Speaking..." : isListening ? "Listening..." : "Tap to speak"}
      </p>
    </div>
  );
};
