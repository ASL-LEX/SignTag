import { useEffect, useRef } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';

const mimeType = 'video/webm; codecs=vp9';

export interface VideoRecordInterfaceProps {
  activeBlob: { blobURL: string | null; blob: Blob | null };
  handleVideoRecordCompletion: (blobURL: string, blob: Blob) => void;
  recording: boolean;
}

export const VideoRecordInterface: React.FC<VideoRecordInterfaceProps> = ({
  recording,
  handleVideoRecordCompletion,
  activeBlob
}) => {
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const recorder = useReactMediaRecorder({
    video: true,
    audio: false,
    mediaRecorderOptions: {
      mimeType
    },
    onStop: (blobURL, blob) => handleVideoRecordCompletion(blobURL, blob),
    blobPropertyBag: {
      type: mimeType
    }
  });

  // Handles switching between live preview and video playback
  useEffect(() => {
    // If in recording mode, show the user the preview
    if (videoPreviewRef.current && recorder.previewStream && recorder.status == 'recording') {
      videoPreviewRef.current.srcObject = recorder.previewStream;
    }
    // Otherwise, show the user the recording video
    else if (videoPreviewRef.current && recorder.mediaBlobUrl) {
      videoPreviewRef.current.src = activeBlob.blobURL || '';
      videoPreviewRef.current.srcObject = null;
    }
  }, [recorder.status, recorder.previewStream, recorder.mediaBlobUrl]);

  // Handle toggling between recording and not recording
  useEffect(() => {
    if (recording) {
      recorder.startRecording();
    } else {
      recorder.stopRecording();
    }
  }, [recording]);

  // Handle switching between previews from other videos
  useEffect(() => {}, [activeBlob]);

  return (
    <>
      <video style={{ minWidth: 500 }} ref={videoPreviewRef} src={recorder.mediaBlobUrl} controls autoPlay loop />
    </>
  );
};
