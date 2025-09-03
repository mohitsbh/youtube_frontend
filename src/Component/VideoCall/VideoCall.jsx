import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import io from 'socket.io-client';
import './VideoCall.css'; // make sure this file is in the same folder

const socket = io('https://yourtube-wtq4.onrender.com');

const VideoCall = ({ roomId, username }) => {
  const [callStarted, setCallStarted] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    peerRef.current = new Peer(undefined, {
      host: '/',
      port: '3001',
      path: '/peerjs',
    });

    peerRef.current.on('open', (id) => {
      socket.emit('join-room', { roomId, userId: id });
    });

    socket.on('user-connected', (userId) => {
      connectToNewUser(userId, localStreamRef.current);
    });

    socket.on('call-ended', () => {
      stopStream();
    });

    return () => {
      socket.disconnect();
      peerRef.current.destroy();
    };
  }, [roomId]);

  const startCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = stream;
    localStreamRef.current = stream;
    setCallStarted(true);

    peerRef.current.on('call', (call) => {
      call.answer(stream);
      call.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
      });
    });
  };

  const connectToNewUser = (userId, stream) => {
    const call = peerRef.current.call(userId, stream);
    call.on('stream', (remoteStream) => {
      remoteVideoRef.current.srcObject = remoteStream;
    });
  };

  const shareScreen = async () => {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const sender = localStreamRef.current.getVideoTracks()[0];

    const trackSender =
      peerRef.current.connections?.[Object.keys(peerRef.current.connections)[0]]?.[0]?.peerConnection
        .getSenders()
        .find((s) => s.track.kind === 'video');

    if (trackSender) {
      trackSender.replaceTrack(screenStream.getVideoTracks()[0]);
    }

    screenStream.getVideoTracks()[0].onended = () => {
      if (trackSender) trackSender.replaceTrack(sender);
    };
  };

  const startRecording = () => {
    recordedChunks.current = [];
    const stream = localVideoRef.current.srcObject;

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.current.push(e.data);
    };

    recorder.onstop = saveRecording;
    recorder.start();
    alert('🔴 Recording started');
  };

  const saveRecording = () => {
    const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recording-${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(url);
    alert('✅ Recording saved locally');
  };

  const stopStream = () => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    remoteVideoRef.current.srcObject = null;
    localVideoRef.current.srcObject = null;
    setCallStarted(false);
    socket.emit('leave-room', roomId);
  };

  return (
    <div className="video-call-container">
      <h2>📞 Room: {roomId}</h2>

      <div className="video-wrapper">
        <video ref={localVideoRef} autoPlay muted className="video-box" />
        <video ref={remoteVideoRef} autoPlay className="video-box" />
      </div>

      <div className="button-controls">
        {!callStarted && (
          <button onClick={startCall} className="btn start">Start Call</button>
        )}
        {callStarted && (
          <>
            <button onClick={shareScreen} className="btn screen">Share Screen</button>
            <button onClick={startRecording} className="btn record">Record</button>
            <button onClick={stopStream} className="btn end">End Call</button>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
