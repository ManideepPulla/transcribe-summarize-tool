
import React, { useState, useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import Header from '@/components/Header';
import RecordingPanel from '@/components/RecordingPanel';
import TranscriptionPanel from '@/components/TranscriptionPanel';
import SummaryPanel from '@/components/SummaryPanel';
import ExportOptions from '@/components/ExportOptions';
import { 
  startTranscription, 
  getMediaStream,
  TranscriptSegment 
} from '@/utils/transcriptionService';
import { 
  generateSummary, 
  SummaryContent 
} from '@/utils/summarizationService';
import { exportNotes } from '@/utils/exportService';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // State for recording and transcription
  const [isRecording, setIsRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [audioSource, setAudioSource] = useState<'mic' | 'system'>('system');
  
  // State for summary
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summary, setSummary] = useState<SummaryContent | null>(null);
  
  // Clean up media stream when component unmounts
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);
  
  // Handle starting recording
  const handleStartRecording = async (source: 'mic' | 'system') => {
    try {
      setAudioSource(source);
      
      // Get media stream based on selected source
      toast({
        title: "Requesting access",
        description: source === 'system' 
          ? "Please select a screen to share and enable system audio" 
          : "Please allow microphone access"
      });
      
      const stream = await getMediaStream(source);
      setMediaStream(stream);
      
      // Log stream details for debugging
      console.log(`Got ${source} stream with ${stream.getAudioTracks().length} audio tracks and ${stream.getVideoTracks().length} video tracks`);
      stream.getAudioTracks().forEach((track, i) => {
        console.log(`Audio track ${i}:`, track.label, track.enabled, track.readyState);
      });
      
      // Start transcription
      const stopTranscription = await startTranscription(stream, (segment) => {
        setTranscript(prev => [...prev, segment]);
      });
      
      // Update state
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: `Your meeting is now being recorded using ${source === 'system' ? 'system audio' : 'microphone'}.`
      });
      
      // Store stop function for later
      window.stopTranscriptionFn = stopTranscription;
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording failed",
        description: source === 'system'
          ? "Could not access system audio. Please check your browser permissions or try using microphone instead."
          : "Could not access your microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };
  
  // Handle stopping recording
  const handleStopRecording = () => {
    // Stop transcription
    if (window.stopTranscriptionFn) {
      window.stopTranscriptionFn();
      delete window.stopTranscriptionFn;
    }
    
    // Stop media stream
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => {
        console.log(`Stopping track: ${track.kind} (${track.label})`);
        track.stop();
      });
      setMediaStream(null);
    }
    
    // Update state
    setIsRecording(false);
    
    toast({
      title: "Recording stopped",
      description: "Your recording has been saved and transcribed."
    });
  };
  
  // Handle generating summary
  const handleGenerateSummary = async () => {
    if (transcript.length === 0) {
      toast({
        title: "No transcript available",
        description: "Please record a meeting before generating a summary.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGeneratingSummary(true);
    
    try {
      const summaryResult = await generateSummary(transcript);
      setSummary(summaryResult);
      
      toast({
        title: "Summary generated",
        description: "AI has created a summary of your meeting."
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Summary generation failed",
        description: "There was an error creating your summary. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };
  
  // Handle exporting notes
  const handleExport = async (format: string) => {
    if (!summary) {
      toast({
        title: "No summary available",
        description: "Please generate a summary before exporting.",
        variant: "destructive"
      });
      return Promise.reject(new Error("No summary available"));
    }
    
    try {
      return await exportNotes(format, transcript, summary);
    } catch (error) {
      console.error('Error exporting notes:', error);
      throw error;
    }
  };
  
  return (
    <MainLayout>
      <Header />
      <div className="mt-8 grid gap-6">
        {isMobile ? (
          // Mobile layout
          <>
            <RecordingPanel
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              isRecording={isRecording}
            />
            
            <TranscriptionPanel
              isRecording={isRecording}
              transcript={transcript}
            />
            
            <SummaryPanel
              transcript={transcript}
              isGeneratingSummary={isGeneratingSummary}
              onGenerateSummary={handleGenerateSummary}
            />
            
            <ExportOptions
              hasSummary={!!summary}
              onExport={handleExport}
              summary={summary}
              transcript={transcript}
            />
          </>
        ) : (
          // Desktop layout
          <>
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-6">
                <RecordingPanel
                  onStartRecording={handleStartRecording}
                  onStopRecording={handleStopRecording}
                  isRecording={isRecording}
                />
                
                <ExportOptions
                  hasSummary={!!summary}
                  onExport={handleExport}
                  summary={summary}
                  transcript={transcript}
                />
              </div>
              
              <div className="col-span-2 grid grid-cols-2 gap-6">
                <TranscriptionPanel
                  isRecording={isRecording}
                  transcript={transcript}
                />
                
                <SummaryPanel
                  transcript={transcript}
                  isGeneratingSummary={isGeneratingSummary}
                  onGenerateSummary={handleGenerateSummary}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Index;

// Add missing type for window object
declare global {
  interface Window {
    stopTranscriptionFn?: () => void;
  }
}
