import { useEffect, useRef, useState } from 'react';
import { Mic, X } from 'lucide-react';
import Button from 'components/ui/Button';
import { useAssistantStore } from 'stores/assistantStore';
import { createWhisperClient } from 'features/recitationCoach/services/whisperClient';

export interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  className?: string;
  iconOnly?: boolean;
}

// Minimal toast function - since no toast utility exists in codebase,
// we use a simple inline notification approach
const showToast = (title: string, description: string, variant?: 'destructive' | 'secondary') => {
  // Simple inline notification using the existing EmptyState pattern
  // In a full app, this would use a proper toast component
  const existing = document.querySelector('.voice-toast');
  if (existing) existing.remove();
  const div = document.createElement('div');
  div.className = 'voice-toast rounded-md p-4 mb-4 transition-all duration-300';
  if (variant === 'destructive') {
    div.style.background = 'var(--color-error-bg, #fee2e2)';
    div.style.color = 'var(--color-error-fg, #dc2626)';
  } else {
    div.style.background = 'var(--color-success-bg, #d1fae5)';
    div.style.color = 'var(--color-success-fg, #059669)';
  }
  div.style.margin = '1rem 0';
  div.innerHTML = `
    <div className="flex items-start">
      <div className="w-3 h-3 rounded-full" style="background: var(--color-primary)"/>
      <div className="ml-3 flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm opacity-90">{description}</p>
      </div>
    </div>
  `;
  document.body.appendChild(div);
  // Auto-remove after 5 seconds
  setTimeout(() => div.remove(), 5000);
};

export default function VoiceInputButton({
  onTranscript,
  disabled = false,
  className,
  iconOnly = false,
}: VoiceInputButtonProps) {
  const isAnswering = useAssistantStore((state) => state.isAnswering);

  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const workerRef = useRef<ReturnType<typeof createWhisperClient> | null>(null);
  const whisperLoadRef = useRef<Promise<unknown> | null>(null);

  // Decode the recording, mix it to mono, then let Web Audio resample it.
  const decodeAndResampleAudio = async (blob: Blob): Promise<Float32Array> => {
    const arrayBuffer = await blob.arrayBuffer();
    const AudioContextConstructor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) throw new Error('Web Audio API is unavailable');

    const audioContext = new AudioContextConstructor();
    try {
      const decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const monoBuffer = audioContext.createBuffer(1, decodedBuffer.length, decodedBuffer.sampleRate);
      const monoChannel = monoBuffer.getChannelData(0);

      for (let channel = 0; channel < decodedBuffer.numberOfChannels; channel += 1) {
        const channelData = decodedBuffer.getChannelData(channel);
        for (let sample = 0; sample < channelData.length; sample += 1) {
          monoChannel[sample] += (channelData[sample] ?? 0) / decodedBuffer.numberOfChannels;
        }
      }

      const targetSampleRate = 16000;
      const targetLength = Math.ceil(decodedBuffer.duration * targetSampleRate);
      const offlineContext = new OfflineAudioContext(1, targetLength, targetSampleRate);
      const source = offlineContext.createBufferSource();
      source.buffer = monoBuffer;
      source.connect(offlineContext.destination);
      source.start();
      const resampledBuffer = await offlineContext.startRendering();
      return new Float32Array(resampledBuffer.getChannelData(0));
    } finally {
      await audioContext.close();
    }
  };

  // Request microphone permission and start recording
  const startRecording = async () => {
    try {
      setIsRecording(true);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : '';
      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.start();
    } catch (error) {
      setIsRecording(false);
      showToast("Microphone access needed", "Microphone access is needed for voice input. Please allow microphone permission in your browser settings.", "destructive");
    }
  };

  // Stop recording and transcribe
  const stopAndTranscribe = async () => {
    const mediaRecorder = mediaRecorderRef.current;
    
    if (!mediaRecorder) {
      setIsRecording(false);
      return;
    }

    // Wait for the mediarecorder to fully stop
    const stopPromise = new Promise<void>((resolve) => {
      mediaRecorder.onstop = () => {
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
        resolve();
      };
    });

    mediaRecorder.stop();
    await stopPromise;

    setIsRecording(false);

    try {
      // Combine chunks into a single blob
      const blob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
      audioChunksRef.current = [];

      // Properly decode and resample the audio
      const audioData = await decodeAndResampleAudio(blob);

      // Transcribe using Whisper
      if (workerRef.current && audioData.length > 0) {
        await whisperLoadRef.current;
        console.info('[Voice diagnostics] audio before Whisper', {
          blobDurationSeconds: audioData.length / 16000,
          sampleRateHz: 16000,
          byteSize: blob.size,
          blobType: blob.type,
          sampleCount: audioData.length,
        });
        const result = await workerRef.current.transcribe(audioData);
        console.info('[Voice diagnostics] raw Whisper text', result.text);
        const text = result.text.trim();
        
        if (text && text.length > 0) {
          onTranscript(text);
        } else {
          showToast("Didn't catch that", "We didn't detect any speech. Please try again.", "secondary");
        }
      } else {
        showToast("Didn't catch that", "Whisper model not ready. Please try again.", "secondary");
      }
    } catch (error) {
      console.error('Transcription error:', error);
      showToast("Transcription failed", "There was an error transcribing your audio. Please try again.", "destructive");
    }
  };

  // Initialize Whisper client when component mounts
  useEffect(() => {
    const client = createWhisperClient({
      onProgress: (info) => {
        // Progress handling optional
      },
    });
    workerRef.current = client;

    // Load the model
    whisperLoadRef.current = client.load();
    whisperLoadRef.current.catch((error) => {
      console.error('Whisper model failed to load:', error);
    });

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={() => isRecording ? stopAndTranscribe() : startRecording()}
      disabled={disabled || isAnswering}
      aria-label={isRecording ? 'Stop recording' : 'Voice input'}
      className={className}
    >
      {!iconOnly && (
        <span
          className={`w-3 h-3 rounded-md ${isRecording ? 'bg-primary/20 pulse' : 'bg-primary/20'} text-primary`}
          aria-hidden="true"
        />
      )}
      {isRecording ? (
        <X size={16} className="text-primary" aria-label="Stop recording" />
      ) : (
        <Mic size={16} />
      )}
      {!iconOnly && (
        <span className={`text-xs capitalize ${isRecording ? 'font-medium' : ''}`}>
          {isRecording ? 'Recording...' : 'Voice'}
        </span>
      )}
    </Button>
  );
}