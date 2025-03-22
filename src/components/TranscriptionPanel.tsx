
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Copy, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { TranscriptSegment } from '@/utils/transcriptionService';

interface TranscriptionPanelProps {
  isRecording: boolean;
  transcript: TranscriptSegment[];
}

const TranscriptionPanel: React.FC<TranscriptionPanelProps> = ({
  isRecording,
  transcript,
}) => {
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Auto-scroll to bottom when new transcripts arrive
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [transcript]);
  
  const handleCopyTranscript = () => {
    const transcriptText = transcript
      .map(item => `[${item.timestamp}] ${item.speaker}: ${item.text}`)
      .join('\n\n');
    
    navigator.clipboard.writeText(transcriptText).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Transcript has been copied to your clipboard."
      });
    });
  };
  
  // Calculate transcript length in seconds or minutes
  const calculateTranscriptLength = () => {
    if (transcript.length === 0) return "0:00";
    
    // Find the last timestamp
    const lastSegment = transcript[transcript.length - 1];
    const timeArr = lastSegment.timestamp.split(':');
    
    // Format for display
    if (timeArr[0] === "00") {
      return `${timeArr[1]}:${timeArr[2]}`; // MM:SS
    } else {
      return `${timeArr[0]}:${timeArr[1]}:${timeArr[2]}`; // HH:MM:SS
    }
  };
  
  return (
    <Card className="glass-panel border-none shadow-smooth h-full flex flex-col animate-enter">
      <CardHeader className="pb-2 pt-6 px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Transcript</CardTitle>
            {transcript.length > 0 && (
              <Badge variant="outline" className="ml-2">
                {calculateTranscriptLength()}
              </Badge>
            )}
          </div>
          {transcript.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 gap-1.5"
              onClick={handleCopyTranscript}
            >
              <Copy className="h-3.5 w-3.5" />
              <span className="text-xs">Copy</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-6 pb-6 pt-2">
        {transcript.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
            {isRecording ? (
              <div className="space-y-3">
                <div className="loader mx-auto">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <p>Listening for speech...</p>
              </div>
            ) : (
              <>
                <FileText className="h-12 w-12 mb-3 text-muted-foreground/50" />
                <h3 className="text-lg font-medium">No Transcript Yet</h3>
                <p className="text-sm max-w-[20rem]">
                  Start recording to see the transcript appear here with speaker identification.
                </p>
              </>
            )}
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-20rem)]" ref={scrollAreaRef}>
            <div className="space-y-4 pr-4">
              {transcript.map((item) => (
                <div key={item.id} className="space-y-1.5 animate-enter">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="h-5 text-xs font-medium">
                      {item.speaker}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                  </div>
                  <p className="leading-relaxed text-sm">{item.text}</p>
                </div>
              ))}
              {isRecording && (
                <div className="h-10 flex items-center">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse delay-100"></span>
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse delay-200"></span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default TranscriptionPanel;
