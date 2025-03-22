
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Mic, Pause, StopCircle, Monitor, Headphones, Upload, FileVideo, Link } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface RecordingPanelProps {
  onStartRecording: (audioSource: 'mic' | 'system') => void;
  onStopRecording: () => void;
  onVideoUpload: (file: File) => void;
  onUrlTranscribe: (url: string) => void;
  isRecording: boolean;
  isProcessing?: boolean;
}

const RecordingPanel: React.FC<RecordingPanelProps> = ({
  onStartRecording,
  onStopRecording,
  onVideoUpload,
  onUrlTranscribe,
  isRecording,
  isProcessing = false,
}) => {
  const { toast } = useToast();
  const [isPaused, setIsPaused] = useState(false);
  const [recordingMode, setRecordingMode] = useState<'live' | 'upload' | 'url'>('live');
  const [audioSource, setAudioSource] = useState<'mic' | 'system'>('system');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [url, setUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    
    toast({
      title: isPaused ? "Recording resumed" : "Recording paused",
      description: isPaused ? "The transcription is now active again." : "The transcription is temporarily paused."
    });
  };
  
  const handleStopRecording = () => {
    onStopRecording();
    setElapsedTime(0);
    setIsPaused(false);
  };
  
  const handleStartRecording = () => {
    // Check browser compatibility for system audio capture
    if (audioSource === 'system' && 
        (!navigator.mediaDevices?.getDisplayMedia || 
         typeof navigator.mediaDevices.getDisplayMedia !== 'function')) {
      toast({
        title: "Browser limitation",
        description: "Your browser doesn't support system audio capture. Using microphone instead.",
        variant: "destructive"
      });
      // Fall back to microphone
      setAudioSource('mic');
      onStartRecording('mic');
      return;
    }
    
    onStartRecording(audioSource);
  };
  
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    
    // Check if file is a video
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file.",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (limit to 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a video file smaller than 100MB.",
        variant: "destructive"
      });
      return;
    }
    
    onVideoUpload(file);
    toast({
      title: "Processing video",
      description: "Your video is being processed for transcription.",
    });
  };
  
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a valid URL.",
        variant: "destructive"
      });
      return;
    }
    
    // Basic URL validation
    try {
      new URL(url);
      
      // Check if it's a YouTube URL
      const isYouTubeUrl = url.includes('youtube.com/') || url.includes('youtu.be/');
      
      onUrlTranscribe(url);
      toast({
        title: isYouTubeUrl ? "Processing YouTube video" : "Processing URL",
        description: "The content is being processed for transcription.",
      });
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL.",
        variant: "destructive"
      });
    }
  };
  
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <Card className="glass-panel border-none shadow-smooth animate-enter">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Meeting Capture</h3>
            {isRecording && (
              <div className="flex items-center gap-2">
                <span className={cn(
                  "h-2 w-2 rounded-full bg-red-500",
                  isPaused ? "" : "animate-pulse"
                )}></span>
                <span className="text-sm font-medium">{formatTime(elapsedTime)}</span>
              </div>
            )}
          </div>
          
          {!isRecording && !isProcessing ? (
            <div className="space-y-6">
              {/* Mode selector tabs */}
              <div className="flex border border-border rounded-md overflow-hidden">
                <button
                  className={cn(
                    "flex-1 py-2 text-sm font-medium",
                    recordingMode === 'live' 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-accent"
                  )}
                  onClick={() => setRecordingMode('live')}
                >
                  Live Recording
                </button>
                <button
                  className={cn(
                    "flex-1 py-2 text-sm font-medium",
                    recordingMode === 'upload' 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-accent"
                  )}
                  onClick={() => setRecordingMode('upload')}
                >
                  Upload Video
                </button>
                <button
                  className={cn(
                    "flex-1 py-2 text-sm font-medium",
                    recordingMode === 'url' 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-accent"
                  )}
                  onClick={() => setRecordingMode('url')}
                >
                  Video URL
                </button>
              </div>
              
              {recordingMode === 'live' && (
                <>
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
                    onClick={handleStartRecording}
                  >
                    <Mic className="mr-2 h-5 w-5" />
                    Start Recording
                  </Button>
                </>
              )}
              
              {recordingMode === 'upload' && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <FileVideo className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h4 className="text-lg font-medium mb-2">Upload Video File</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload a video file (MP4, WebM, MOV) to extract transcription
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="video/*"
                      onChange={handleVideoUpload}
                    />
                    <Button onClick={triggerFileUpload}>
                      <Upload className="mr-2 h-4 w-4" />
                      Select Video
                    </Button>
                  </div>
                </div>
              )}
              
              {recordingMode === 'url' && (
                <div className="space-y-4">
                  <div className="rounded-lg p-4 border border-border">
                    <h4 className="text-lg font-medium mb-2">Transcribe from URL</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Enter a YouTube URL or direct video link to extract transcription
                    </p>
                    <form onSubmit={handleUrlSubmit} className="flex gap-2">
                      <Input
                        placeholder="https://youtube.com/watch?v=..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit">
                        <Link className="mr-2 h-4 w-4" />
                        Process
                      </Button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="loader mb-4">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <p className="text-center text-muted-foreground">
                    Processing your media for transcription...
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-center">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <div className={cn(
                        "absolute inset-0 rounded-full bg-red-100/10",
                        !isPaused && "animate-pulse"
                      )}></div>
                      <div className={cn(
                        "absolute inset-2 rounded-full bg-red-100/20",
                        !isPaused && "animate-pulse animation-delay-100"
                      )}></div>
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
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecordingPanel;
