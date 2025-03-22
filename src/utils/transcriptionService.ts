
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

// Mock YouTube video transcript segments
const MOCK_YOUTUBE_SENTENCES = [
  "Welcome to this tutorial on modern web development.",
  "Today we'll explore the latest trends in frontend frameworks.",
  "React continues to be one of the most popular choices for developers.",
  "However, Vue and Svelte are gaining significant traction as well.",
  "Let's dive into the key differences between these technologies.",
  "React uses a virtual DOM approach to optimize rendering.",
  "Vue combines the best aspects of several frameworks.",
  "Svelte takes a compile-time approach to reactivity.",
  "Each framework has its own strengths and ideal use cases.",
  "Performance benchmarks show interesting trade-offs between them.",
  "Developer experience is also an important consideration.",
  "The ecosystem around each framework continues to evolve rapidly.",
  "Let's look at some code examples to better understand the syntax differences.",
  "Community support is another key factor when choosing a framework.",
  "The job market currently has high demand for React developers.",
  "But knowledge of multiple frameworks makes you more versatile as a developer."
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
  
  // Check if stream has audio tracks
  const audioTracks = mediaStream.getAudioTracks();
  if (audioTracks.length === 0) {
    console.warn('No audio tracks found in the provided media stream');
  } else {
    console.log(`Audio tracks found: ${audioTracks.length}`);
    audioTracks.forEach((track, i) => {
      console.log(`Track ${i}: ${track.label} (${track.kind})`);
      console.log(`Track settings:`, track.getSettings());
    });
  }
  
  // Set up an AudioContext to process the audio in a real implementation
  // This is a placeholder for demonstration
  try {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(mediaStream);
    console.log('AudioContext and MediaStreamSource created successfully');
    
    // In a real implementation, we would connect this to an analyzer
    // or process it for sending to a transcription service
    
    // For demo purposes, we're just confirming we can access the audio
    // and then continuing with our mock implementation
  } catch (error) {
    console.error('Error setting up audio processing:', error);
  }
  
  // For demo purposes, we'll simulate transcription with a timer
  // In a real implementation, this would be replaced with actual
  // transcription processing of the audio stream
  const intervalId = setInterval(() => {
    const randomSpeaker = SPEAKERS[Math.floor(Math.random() * SPEAKERS.length)];
    const randomSentence = MOCK_SENTENCES[Math.floor(Math.random() * MOCK_SENTENCES.length)];
    
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
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

// New function to handle video upload transcription
export const transcribeVideoFile = async (
  file: File,
  onTranscriptUpdate: (segment: TranscriptSegment) => void,
  onComplete: () => void
): Promise<void> => {
  console.log('Processing uploaded video file:', file.name, file.type, file.size);
  
  // In a real implementation, you would:
  // 1. Either upload the file to a server for processing
  // 2. Or use WebAssembly to process it in-browser with something like ffmpeg.wasm
  
  // For demo purposes, we'll simulate processing with a delay
  // and then provide mock transcript segments
  
  // Simulate processing time based on file size
  const processingTime = Math.min(5000, Math.floor(file.size / 1000000) * 500);
  
  // After "processing", start providing transcript segments
  setTimeout(() => {
    // Sort sentences to create a more coherent narrative
    const sortedSentences = [...MOCK_SENTENCES].sort(() => Math.random() - 0.5);
    
    // Generate 8-12 segments (random number)
    const segmentCount = Math.floor(Math.random() * 5) + 8;
    
    // Create a sequence of transcript segments with increasing timestamps
    for (let i = 0; i < segmentCount; i++) {
      setTimeout(() => {
        const speaker = SPEAKERS[i % SPEAKERS.length];
        const text = sortedSentences[i % sortedSentences.length];
        
        // Create timestamps that look sequential
        const minutes = Math.floor(i / 4);
        const seconds = (i % 4) * 15;
        const timestamp = `00:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        onTranscriptUpdate({
          id: nanoid(),
          speaker,
          text,
          timestamp,
        });
        
        // Signal completion after the last segment
        if (i === segmentCount - 1) {
          setTimeout(onComplete, 1000);
        }
      }, i * 1000); // Space segments by 1 second
    }
  }, processingTime);
};

// New function to handle URL transcription (YouTube or direct video URLs)
export const transcribeFromUrl = async (
  url: string,
  onTranscriptUpdate: (segment: TranscriptSegment) => void,
  onComplete: () => void
): Promise<void> => {
  console.log('Processing video from URL:', url);
  
  // In a real implementation, you would:
  // 1. Extract video ID if it's YouTube
  // 2. Use YouTube API or a service to get transcript
  // 3. Or for direct video URLs, download and process the video
  
  const isYouTubeUrl = url.includes('youtube.com/') || url.includes('youtu.be/');
  console.log('Detected URL type:', isYouTubeUrl ? 'YouTube' : 'Direct video');
  
  // Simulate processing delay
  const processingDelay = isYouTubeUrl ? 3000 : 5000;
  
  // After "processing", provide mock transcript
  setTimeout(() => {
    // Use YouTube-specific sentences for YouTube URLs
    const sentencesToUse = isYouTubeUrl ? MOCK_YOUTUBE_SENTENCES : MOCK_SENTENCES;
    
    // Generate 10-15 segments (random number)
    const segmentCount = Math.floor(Math.random() * 6) + 10;
    
    // Create a sequence of transcript segments with increasing timestamps
    for (let i = 0; i < segmentCount; i++) {
      setTimeout(() => {
        const speaker = isYouTubeUrl 
          ? 'Presenter' // For YouTube, use a single presenter
          : SPEAKERS[i % SPEAKERS.length];
        
        const text = sentencesToUse[i % sentencesToUse.length];
        
        // Create timestamps that look sequential
        const minutes = Math.floor(i / 5);
        const seconds = (i % 5) * 12;
        const timestamp = `00:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        onTranscriptUpdate({
          id: nanoid(),
          speaker,
          text,
          timestamp,
        });
        
        // Signal completion after the last segment
        if (i === segmentCount - 1) {
          setTimeout(onComplete, 1000);
        }
      }, i * 1200); // Space segments by 1.2 seconds
    }
  }, processingDelay);
};

// Helper function to get user media with appropriate constraints
export const getMediaStream = async (source: 'mic' | 'system'): Promise<MediaStream> => {
  try {
    if (source === 'mic') {
      console.log('Requesting microphone access...');
      return await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
    } else {
      // For system audio + screen capture
      console.log('Requesting system audio + screen capture...');
      
      // First check if getDisplayMedia is supported
      if (!navigator.mediaDevices.getDisplayMedia) {
        throw new Error('getDisplayMedia is not supported in this browser');
      }
      
      // Note: getDisplayMedia with audio may not be supported in all browsers
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: {
          displaySurface: 'monitor',
          logicalSurface: true,
          cursor: 'always'
        } as any,
        audio: {
          suppressLocalAudioPlayback: false,
          echoCancellation: true,
          noiseSuppression: true
        } as any
      });
      
      // Check if we got audio tracks
      if (stream.getAudioTracks().length === 0) {
        console.warn('No audio tracks were captured from system. This may be due to browser or OS limitations.');
        console.log('Attempting to combine with microphone audio as fallback...');
        
        try {
          // Try to add microphone audio as a fallback
          const micStream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
              echoCancellation: true,
              noiseSuppression: true
            }
          });
          
          // Add microphone tracks to the stream
          micStream.getAudioTracks().forEach(track => {
            stream.addTrack(track);
          });
          
          console.log('Successfully added microphone audio as fallback');
        } catch (micError) {
          console.error('Could not add microphone audio as fallback:', micError);
        }
      }
      
      return stream;
    }
  } catch (error) {
    console.error('Error accessing media devices:', error);
    throw error;
  }
};

// Helper to combine multiple media streams
export const combineMediaStreams = (...streams: MediaStream[]): MediaStream => {
  const combinedStream = new MediaStream();
  
  // Add all tracks from all streams to the combined stream
  for (const stream of streams) {
    stream.getTracks().forEach(track => {
      combinedStream.addTrack(track);
    });
  }
  
  return combinedStream;
};
