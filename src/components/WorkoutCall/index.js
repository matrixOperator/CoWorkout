import { useState, useCallback, useEffect } from 'react';
import Session from './Session';
import Video from 'twilio-video';
import Preview from './Preview';

// generate token here, no need for external route
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

export default function WorkoutCall(props) {
  const REACT_APP_TWILIO_ACCOUNT_SID = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
  const REACT_APP_TWILIO_API_KEY_SID = process.env.REACT_APP_TWILIO_API_KEY;
  const REACT_APP_TWILIO_API_KEY_SECRET = process.env.REACT_APP_TWILIO_API_SECRET;

  const [username, setUsername] = useState("testUser");
  const [roomName, setRoomName] = useState("testRoom");
  const [room, setRoom] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const connectToRoom = useCallback(
    async (event) => {
      event.preventDefault();
      setConnecting(true);
      const JWT = createJwt(username, roomName);
      Video.connect(JWT, {
        name: roomName,
      })
        .then((room) => {
          setConnecting(false);
          setRoom(room);
        })
        .catch((err) => {
          console.error(err);
          setConnecting(false);
        });
    },
    []
  );

  const endSession = useCallback(() => {
    setRoom((prevRoom) => {
      if (prevRoom) {
        prevRoom.localParticipant.tracks.forEach((trackPub) => {
          trackPub.track.stop();
        });
        prevRoom.disconnect();
      }
      return null;
    });
  }, []);

  // create access token for user
  const createJwt = function(identity = 'testuser', roomName = 'testroom') {
    const token = new AccessToken(REACT_APP_TWILIO_ACCOUNT_SID, REACT_APP_TWILIO_API_KEY_SID, REACT_APP_TWILIO_API_KEY_SECRET, { ttl: 14400 });
    token.identity = identity;
    const videoGrant = new VideoGrant({ room: roomName });
    token.addGrant(videoGrant);
    console.log(`Generated token for ${identity} to join ${roomName}`);
    return token.toJwt();
  };

  useEffect(() => {
    if (room) {
      const tidyUp = (event) => {
        if (event.persisted) {
          return;
        }
        if (room) {
          endSession();
        }
      };
      window.addEventListener("pagehide", tidyUp);
      window.addEventListener("beforeunload", tidyUp);
      return () => {
        window.removeEventListener("pagehide", tidyUp);
        window.removeEventListener("beforeunload", tidyUp);
      };
    }
  }, [room, endSession]);

  let render;
  if (room) {
    render = (
      <Session roomName={roomName} room={room} endSession={endSession} />
    );
  } else {
    const fakeLocalParticipant = {
      'identity': 'Video Preview'
    }
    render = (
      <>
        <Preview participant={fakeLocalParticipant}/>
        <button onClick={(event) => {connectToRoom(event)}}>I'm Ready!</button>
      </>
    );
  }
  return render;
};