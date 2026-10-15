export interface Transcriber {
  transcribe(audio: Blob): Promise<string>;
}

/**
 * TODO: replace with the real speech-to-text provider (upload audio to an API
 * route, return the transcript). Audio must never be stored, transcript only.
 * This dev stand-in ignores the audio and returns the given transcript.
 */
export function createMockTranscriber(mockTranscript: string): Transcriber {
  return {
    async transcribe() {
      await new Promise((resolve) => setTimeout(resolve, 900));
      return mockTranscript;
    },
  };
}
