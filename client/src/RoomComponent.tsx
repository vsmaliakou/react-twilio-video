import { useEffect, useState } from "react";
import Video, { LocalVideoTrack, RemoteParticipant, Room } from "twilio-video";
import { Participant } from "./Participant";

interface IRoomComponent {
  roomName: string;
  token: string;
  handleLogout: () => void;
}

export const RoomComponent: React.FC<IRoomComponent> = ({ roomName, token, handleLogout }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState([]);

  const remoteParticipants = participants.map((participant: any) => {
    console.log(participant);
    return <Participant key={participant.sid} participant={participant} />
});

  useEffect(() => {
    const participantConnected = (participant: RemoteParticipant) => {
      // @ts-ignore
      setParticipants(prevParticipants => [...prevParticipants, participant]);
    };
    const participantDisconnected = (participant: RemoteParticipant) => {
      setParticipants(prevParticipants =>
        prevParticipants.filter(p => p !== participant)
      );
    };
    Video.connect(token, {
      name: 'room-video'
    }).then((room: Room) => {
      setRoom(room);
      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      room.participants.forEach(participantConnected);
    });

    return () => {
      setRoom(currentRoom => {
        // @ts-ignore
        if (currentRoom && currentRoom.localParticipant.state === 'connected') {
          // @ts-ignore
          currentRoom.localParticipant.tracks.forEach(function(trackPublication) {
            (trackPublication.track as LocalVideoTrack).stop();
          });
          // @ts-ignore
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [roomName, token]);

  return (
    <div className="room">
      <h2>Room: {roomName}</h2>
      <button onClick={handleLogout}>Log out</button>
      <div className="local-participant">
        {room ? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}
          />
        ) : (
          'qwe'
        )}
      </div>
      <h3>Remote Participants</h3>
      <div className="remote-participants">{remoteParticipants}</div>
    </div>
  );
};
