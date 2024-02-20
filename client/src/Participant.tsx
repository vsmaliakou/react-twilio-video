import { useEffect, useRef, useState } from "react";
import { LocalParticipant, RemoteAudioTrack, RemoteParticipant, RemoteTrack, RemoteVideoTrack } from "twilio-video";

interface IParticipantComponent {
  participant: RemoteParticipant | LocalParticipant;
}

export const Participant: React.FC<IParticipantComponent> = ({ participant }) => {
  const [videoTracks, setVideoTracks] = useState<RemoteVideoTrack[]>([]);
  const [audioTracks, setAudioTracks] = useState<RemoteAudioTrack[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);


  // @ts-ignore
  const trackpubsToTracks = (trackMap: Map<Track.SID, RemoteVideoTrackPublication> | Map<string, Video.LocalVideoTrackPublication> | Map<string, RemoteAudioTrackPublication> | Map<string, LocalAudioTrackPublication>) => Array.from(trackMap.values())
    .map(publication => publication.track)
    .filter(track => track !== null);

  useEffect(() => {
    const trackSubscribed = (track: RemoteTrack) => {
      // implementation
    };

    const trackUnsubscribed = (track: RemoteTrack) => {
      // implementation
    };
    setVideoTracks(trackpubsToTracks(participant.videoTracks) as RemoteVideoTrack[]);
    // @ts-ignore
    setAudioTracks(trackpubsToTracks(participant.audioTracks) as RemoteAudioTrack[]);

    participant.on('trackSubscribed', trackSubscribed);
    participant.on('trackUnsubscribed', trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant?.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      // @ts-ignore
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      // @ts-ignore
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  return (
    <div className="participant">
      <h3>{participant?.identity}</h3>
      <video ref={videoRef} autoPlay={true} />
      {/* @ts-ignore */}
      <audio ref={audioRef} autoPlay={true} />
    </div>
  );
};
