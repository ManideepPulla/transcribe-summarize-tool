
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Pause, StopCircle, Monitor, Headphones } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecordingPanelProps {
  onStartRecording: () => void;
  onStopRecording: () => void;
  isRecording: boolean;
}

const RecordingPanel: React.FC<RecordingPanelProps> = ({
  onStartRecording,
  onStopRecording,
  isRecording,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [audioSource, setAudioSource] = useState<'mic' | 'system'>('system');
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Time formatting helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Update timer when recording
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);
  
  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };
  
  const handleStopRecording = () => {
    onStopRecording();
    setElapsedTime(0);
    setIsPaused(false);
  };
  
  return (
    <Card className="glass-panel border-none shadow-smooth animate-enter">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Meeting Capture</h3>
            {isRecording && (
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-sm font-medium">{formatTime(elapsedTime)}</span>
              </div>
            )}
          </div>
          
          {!isRecording ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className={cn(
                    "h-20 flex flex-col items-center justify-center gap-2 border border-border",
                    audioSource === 'system' && "border-primary/50 bg-primary/5"
                  )}
                  onClick={() => setAudioSource('system')}
                >
                  <Monitor className="h-6 w-6" />
                  <span className="text-sm">System Audio</span>
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "h-20 flex flex-col items-center justify-center gap-2 border border-border",
                    audioSource === 'mic' && "border-primary/50 bg-primary/5"
                  )}
                  onClick={() => setAudioSource('mic')}
                >
                  <Headphones className="h-6 w-6" />
                  <span className="text-sm">Microphone</span>
                </Button>
              </div>
              
              <Button 
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white"
                onClick={onStartRecording}
              >
                <Mic className="mr-2 h-5 w-5" />
                Start Recording
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-red-100/10 animate-pulse"></div>
                  <div className="absolute inset-2 rounded-full bg-red-100/20 animate-pulse animation-delay-100"></div>
                  <div className="relative z-10">
                    <Mic className="h-10 w-10 text-red-500" />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 h-12"
                  onClick={handleTogglePause}
                >
                  {isPaused ? (
                    <Mic className="mr-2 h-5 w-5" />
                  ) : (
                    <Pause className="mr-2 h-5 w-5" />
                  )}
                  {isPaused ? "Resume" : "Pause"}
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 h-12"
                  onClick={handleStopRecording}
                >
                  <StopCircle className="mr-2 h-5 w-5" />
                  Stop
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecordingPanel;
