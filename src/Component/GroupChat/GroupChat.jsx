import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { getMessages, sendMessage as sendMessageAction } from '../../action/message';
import './GroupChat.css';
import {
  IoMdClose,
  IoMdChatboxes,
  IoMdVideocam,
  IoMdDesktop,
  IoMdMic,
  IoMdSend
} from 'react-icons/io';
import { MdAttachFile } from 'react-icons/md';
import { FaSmile } from 'react-icons/fa';

const socket = io('https://youtube-backend-8hha.onrender.com'); // Update as needed

const GroupChat = ({ group }) => {
  const [text, setText] = useState('');
  const [chatOpen, setChatOpen] = useState(true);
  const [inCall, setInCall] = useState(false);
  const [recording, setRecording] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.currentuserreducer);
  const userEmail = user?.result?.email;
  const groupId = group?._id;

  const messageEndRef = useRef();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  const messages = useSelector((state) =>
    groupId ? state.message.groupMessages[groupId] || [] : []
  );

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!groupId || !user?.token) return;

    socket.emit('joinGroup', groupId);
    dispatch(getMessages(groupId));

    const handleIncoming = (msg) => {
      if (msg.groupId === groupId && msg.sender !== userEmail) {
        dispatch({
          type: 'SEND_MESSAGE_SUCCESS',
          payload: { groupId, message: msg },
        });
      }
    };

    socket.on('receiveMessage', handleIncoming);

    socket.on('offer', async ({ offer, from }) => {
      peerConnection.current = createPeer(from);
      await peerConnection.current.setRemoteDescription(offer);
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit('answer', { answer, to: from });
    });

    socket.on('answer', async ({ answer }) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(answer);
      }
    });

    socket.on('ice-candidate', async ({ candidate }) => {
      if (peerConnection.current) {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on('videoCallInvite', ({ caller, roomLink }) => {
      if (caller !== userEmail) {
        const join = window.confirm(`${caller} started a video call. Join?`);
        if (join) window.open(roomLink, '_blank');
      }
    });

    socket.on('endCall', ({ caller }) => {
      if (caller !== userEmail) {
        alert(`${caller} ended the call.`);
        endCall();
      }
    });

    return () => {
      socket.emit('leaveGroup', groupId);
      socket.off('receiveMessage', handleIncoming);
      socket.off('videoCallInvite');
      socket.off('endCall');
      endCall();
    };
  }, [groupId, user?.token, dispatch]);

  const handleSend = async () => {
    if (!text.trim()) return;
    const message = await dispatch(sendMessageAction(groupId, text.trim()));
    if (message) socket.emit('sendMessage', message);
    setText('');
  };

  const formatTime = (iso) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  const startCall = async () => {
    try {
      setInCall(true);
      localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = localStream.current;

      peerConnection.current = createPeer();
      localStream.current.getTracks().forEach((track) =>
        peerConnection.current.addTrack(track, localStream.current)
      );

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      const otherMembers = group.members.filter((m) => m !== userEmail);
      const firstPeer = otherMembers[0];

      socket.emit('offer', { offer, to: firstPeer });

      socket.emit('startVideoCall', {
        groupId,
        caller: userEmail,
        members: group.members,
        roomLink: window.location.href,
      });
    } catch (err) {
      alert('❌ Could not access camera or microphone.');
      setInCall(false);
    }
  };

  const endCall = () => {
    socket.emit('leaveCall', { groupId, userId: userEmail });
    setInCall(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (peerConnection.current) peerConnection.current.close();
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

  const shareScreen = async () => {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const screenTrack = screenStream.getVideoTracks()[0];
    const sender = peerConnection.current?.getSenders().find((s) => s.track.kind === 'video');

    if (sender) sender.replaceTrack(screenTrack);

    screenTrack.onended = () => {
      const originalTrack = localStream.current?.getVideoTracks()[0];
      if (sender && originalTrack) sender.replaceTrack(originalTrack);
    };
  };

  const startRecording = () => {
    if (!localStream.current) return alert('No media stream to record');
    setRecording(true);
    recordedChunks.current = [];

    const recorder = new MediaRecorder(localStream.current);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `group-call-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      alert('✅ Recording saved locally');
      setRecording(false);
    };

    recorder.start();
    alert('🔴 Recording started');
  };

  const createPeer = (to = null) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    peer.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    peer.onicecandidate = (event) => {
      if (event.candidate && to) {
        socket.emit('ice-candidate', { candidate: event.candidate, to });
      }
    };

    return peer;
  };

  if (!groupId) return null;

  return (
    <div className="chat-container">
      <button className="toggle-chat-btn" onClick={() => setChatOpen(!chatOpen)}>
        {chatOpen ? <IoMdClose size={20} /> : <IoMdChatboxes size={20} />}
        {chatOpen ? ' Close Chat' : ' Open Chat'}
      </button>

      {chatOpen && (
        <>
          <div className="group-info">
            <h2>{group.name}</h2>
            <p><strong>Created By:</strong> {group.createdBy?.email || 'N/A'}</p>
            <p><strong>Members:</strong></p>
            <ul className="member-list">
              {group.members.map((m, idx) => (
                <li key={idx}>{m}</li>
              ))}
            </ul>
            <div className="call-controls">
              {!inCall && <button onClick={startCall}><IoMdVideocam /> Start Call</button>}
              {inCall && (
                <>
                  <button onClick={shareScreen}><IoMdDesktop /> Share Screen</button>
                  <button onClick={startRecording}><IoMdMic /> Record</button>
                  <button onClick={endCall}><IoMdClose /> End</button>
                </>
              )}
            </div>
          </div>

          <div className="video-call-section" style={{ display: inCall ? 'flex' : 'none' }}>
            <video ref={localVideoRef} autoPlay muted className="video-box" />
            <video ref={remoteVideoRef} autoPlay className="video-box" />
          </div>

          <div className="chat-box">
            {messages.map((m, i) => {
              const mine = m.sender === userEmail;
              const initials = (m.sender || '').split('@')[0]?.charAt(0)?.toUpperCase() || '?';
              return (
                <div key={m._id || i} className={`chat-row ${mine ? 'mine' : 'theirs'}`}>
                  {!mine && (
                    <div className="avatar" title={m.sender}>{initials}</div>
                  )}
                  <div className={`bubble ${mine ? 'bubble-mine' : 'bubble-other'}`}>
                    {!mine && <div className="bubble-sender">{m.sender}</div>}
                    <div className="bubble-text">{m.content}</div>
                    <div className="bubble-meta">
                      <span className="time">{formatTime(m.createdAt || m.created_at || m._id)}</span>
                    </div>
                  </div>
                  {mine && (
                    <div className="avatar avatar-right" title={m.sender}>{initials}</div>
                  )}
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>

          <div className="chat-input">
            <label className="attach-btn" title="Attach">
              <MdAttachFile size={18} />
              <input type="file" style={{ display: 'none' }} />
            </label>
            <button className="emoji-btn" title="Emoji" onClick={() => { /* placeholder for emoji picker */ }}>
              <FaSmile />
            </button>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message"
              rows={1}
            />
            <button className="send-btn" onClick={handleSend} title="Send"><IoMdSend /></button>

          </div>
        </>
      )}
    </div>
  );
};

export default GroupChat;
