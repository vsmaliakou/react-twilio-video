import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { RoomComponent } from "./RoomComponent";
import { Lobby } from "./Lobby";

export const VideoChat = () => {
  const [username, setUsername] = useState<string>('');
  const [roomName, setRoomName] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);

  const handleUsernameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  }, []);

  const handleRoomNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  }, []);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = await fetch('http://localhost:4000/token', {
      method: 'POST',
      body: JSON.stringify({
        identity: username,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json());
    setToken(data.token);
  }, [username]);

  const handleLogout = useCallback(() => {
    setToken(null);
  }, []);

  let render;
  if (token) {
    render = (
      <RoomComponent roomName={roomName} token={token} handleLogout={handleLogout} />
    );
  } else {
    render = (
      <Lobby
         username={username}
         roomName={roomName}
         handleUsernameChange={handleUsernameChange}
         handleRoomNameChange={handleRoomNameChange}
         handleSubmit={handleSubmit}
      />
    );
  }
  return render;
};
