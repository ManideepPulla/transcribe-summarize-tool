
// This is a mock implementation for the transcription service
// In a real application, you would replace this with actual API calls

import { nanoid } from '@/lib/utils';

// Mock speakers for demonstrating speaker diarization
const SPEAKERS = ['Speaker A', 'Speaker B', 'Speaker C'];

// Mock transcript segments for demonstration
const MOCK_SENTENCES = [
  "I think we should prioritize the mobile app development first.",
  "I agree, our analytics show higher engagement on mobile.",
  "What about the desktop experience though? We still have many users there.",
  "Good point. Maybe we can implement responsive design for both platforms.",
  "We need to consider the resource constraints and timeline.",
  "According to the data, 65% of our users access the platform via mobile.",
  "The development team has more experience with mobile frameworks.",
  "Let's create a phased approach, starting with mobile and then expanding.",
  "I'm concerned about the learning curve for new developers.",
  "We could leverage existing libraries to accelerate development.",
  "User testing indicates a preference for simplified mobile interfaces.",
  "What if we adopt a progressive web app approach?",
  "That would give us the best of both worlds.",
  "We should document our technical requirements thoroughly.",
  "Are there any compliance issues we need to address?",
  "Security should be our top priority regardless of platform."
];

// Interface for transcript segment
export interface TranscriptSegment {
  id: string;
  speaker: string;
  text: string;
  timestamp: string;
}

// Mock function to start transcription
export const startTranscription = async (
  mediaStream: MediaStream,
  onTranscriptUpdate: (segment: TranscriptSegment) => void
): Promise<() => void> => {
  console.log('Starting transcription with media stream:', mediaStream);
  
  // In a real implementation, we would:
  // 1. Set up WebSocket connection to transcription service
  // 2. Stream audio data to the service
  // 3. Receive and process transcription results
  
  // For demo purposes, we'll simulate transcription with a timer
  const intervalId = setInterval(() => {
    const randomSpeaker = SPEAKERS[Math.floor(Math.random() * SPEAKERS.length)];
    const randomSentence = MOCK_SENTENCES[Math.floor(Math.random() * MOCK_SENTENCES.length)];
    
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    onTranscriptUpdate({
      id: nanoid(),
      speaker: randomSpeaker,
      text: randomSentence,
      timestamp,
    });
  }, 3000); // New transcript segment every 3 seconds
  
  // Return a function to stop the transcription
  return () => {
    clearInterval(intervalId);
    console.log('Transcription stopped');
  };
};

// Helper function to get user media with appropriate constraints
export const getMediaStream = async (source: 'mic' | 'system'): Promise<MediaStream> => {
  try {
    if (source === 'mic') {
      return await navigator.mediaDevices.getUserMedia({ audio: true });
    } else {
      // For system audio + screen capture
      // Note: getDisplayMedia with audio may not be supported in all browsers
      return await navigator.mediaDevices.getDisplayMedia({ 
        video: true,
        audio: true 
      });
    }
  } catch (error) {
    console.error('Error accessing media devices:', error);
    throw error;
  }
};
