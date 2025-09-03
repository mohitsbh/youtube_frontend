import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlay, FaPause, FaVolumeUp, FaExpand,
  FaDownload, FaCompress, FaRegClock
} from "react-icons/fa";
import { MdPictureInPictureAlt, MdSettings } from "react-icons/md";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadVideoById,
  getAvailableResolutions,
  getDownloadCount,
} from "../../action/download";
import "./VideoPlayer.css";

const PLAN_LIMITS = {
  free: { dailyDownloads: 1, maxViewMinutes: 1 },
  bronze: { dailyDownloads: 10, maxViewMinutes: 7 },
  silver: { dailyDownloads: 20, maxViewMinutes: 10 },
  gold: { dailyDownloads: Infinity, maxViewMinutes: Infinity },
};

const formatTime = (s) => {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
};

const BASE_URL ="https://yourtube-wtq4.onrender.com";

const VideoPlayer = ({
  src,
  resolutions = {},
  videoid,
  title = "video",
  compact = false,
  previewOnly = false,
  onVideoEnd = () => { },
  thumbnail,
}) => {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const dispatch = useDispatch();

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolume, setShowVolume] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showResMenu, setShowResMenu] = useState(false);
  const [currentRes, setCurrentRes] = useState("720p");
  const [currentSrc, setCurrentSrc] = useState("");

  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [availableResolutions, setAvailableResolutions] = useState([]);
  const [loadingRes, setLoadingRes] = useState(false);
  const [remainingDownloads, setRemainingDownloads] = useState(null);

  const user = useSelector((state) => state.currentuserreducer?.result || {});
  const plan = (user?.plan || "free").toLowerCase();
  const navigate = useNavigate();

  const normalizePath = (path) =>
    `${BASE_URL}/uploads/${path.replace(/^uploads[\\/]+/, "").replace(/\\/g, "/")}`;

  useEffect(() => {
    if (resolutions && Object.keys(resolutions).length > 0) {
      const defaultPath = resolutions[currentRes] || Object.values(resolutions)[0];
      setCurrentSrc(normalizePath(defaultPath));
    } else if (src) {
      setCurrentSrc(normalizePath(src));
    }
  }, [src, resolutions, currentRes]);

  // useEffect(() => {
  //   const max = PLAN_LIMITS[plan]?.maxViewMinutes;
  //   if (!videoRef.current || max === Infinity || previewOnly) return;

  //   const timer = setInterval(() => {
  //     if (videoRef.current?.currentTime >= max * 60) {
  //       videoRef.current.pause();
  //       setIsPlaying(false);
  //       alert(`⏳ Your ${plan.toUpperCase()} plan limit (${max} minutes) has been reached.`);
  //     }
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, [plan, previewOnly]);

  const togglePlay = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (v.paused) {
        await v.play();
        setIsPlaying(true);
      } else {
        v.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      console.warn("Autoplay/playback failed:", err);
    }
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentNode;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const togglePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.error("❌ PiP error:", err);
    }
  };

  const handleProgress = () => {
    const v = videoRef.current;
    if (!v) return;
    const curr = Number.isFinite(v.currentTime) ? v.currentTime : 0;
    setCurrentTime(curr);

    if (progressRef.current) {
      if (Number.isFinite(v.duration) && v.duration > 0 && Number.isFinite(curr)) {
        const pct = (curr / v.duration) * 100;
        progressRef.current.value = Number.isFinite(pct) ? pct : 0;
      } else {
        // fallback to 0 when we can't compute a valid percentage
        progressRef.current.value = 0;
      }
    }
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const val = parseFloat(e.target.value);
    if (!Number.isFinite(val)) return;
    const newTime = (val / 100) * duration;
    if (!Number.isFinite(newTime)) return;

    const maxTime = PLAN_LIMITS[plan].maxViewMinutes * 60;
    if (previewOnly || maxTime === Infinity || newTime <= maxTime) {
      videoRef.current.currentTime = newTime;
    } else {
      videoRef.current.currentTime = maxTime;
      setShowLimitModal(true);
    }
  };


  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    if (videoRef.current) videoRef.current.volume = vol;
    setVolume(vol);
  };

  const seekRelative = (s) => {
    const v = videoRef.current;
    if (!v) return;
    const curr = Number.isFinite(v.currentTime) ? v.currentTime : 0;
    const durIsFinite = Number.isFinite(v.duration) && v.duration > 0;
    let target = curr + s;
    if (durIsFinite) {
      target = Math.max(0, Math.min(v.duration, target));
    } else {
      target = Math.max(0, target);
    }
    if (Number.isFinite(target)) v.currentTime = target;
  };

  const handleResolutionChange = (label) => {
    const path = resolutions[label];
    if (!path) return alert(`❌ ${label} not available`);
    setCurrentRes(label);
    setCurrentSrc(normalizePath(path));
  };

  const handleDownload = async () => {
    // require login
    if (!user?._id) {
      alert("Please login to download videos.");
      return;
    }

    // check remaining allowance
    const res = await dispatch(getDownloadCount());
    if (!res.success) {
      alert("⚠️ Unable to check download limits. Please try later.");
      return;
    }

    const remaining = res.data?.remaining;
    if (remaining === "Unlimited" || (typeof remaining === 'number' && remaining > 0)) {
      // fetch available resolutions then show modal for user to pick
      const avail = await dispatch(getAvailableResolutions(videoid));
      const available = avail?.data?.available || [];
      if (!available || available.length === 0) {
        alert("⚠️ No downloadable resolution available for this video.");
        return;
      }
      setAvailableResolutions(available);
      setShowDownloadModal(true);
    } else {
      alert("⚠️ You have reached your daily download limit. Please upgrade to premium for unlimited downloads.");
      navigate("/upgrade");
    }
  };

  // 🎯 Tap Gesture Detection
  const [tapCount, setTapCount] = useState(0);
  const tapTimeout = useRef(null);

  const handleTap = (e) => {
    const { clientX } = e.touches?.[0] || e;
    const width = window.innerWidth;
    let region = "center";

    if (clientX < width * 0.33) region = "left";
    else if (clientX > width * 0.66) region = "right";

    clearTimeout(tapTimeout.current);
    const newCount = tapCount + 1;
    setTapCount(newCount);

    tapTimeout.current = setTimeout(() => {
      switch (newCount) {
        case 1:
          if (region === "center") togglePlay();
          break;
        case 2:
          if (region === "left") seekRelative(-10);
          else if (region === "right") seekRelative(10);
          break;
        case 3:
          if (region === "center") onVideoEnd();
          else if (region === "right") window.close();
          else if (region === "left") {
            const event = new CustomEvent("showComments");
            window.dispatchEvent(event);
          }
          break;
        default:
          break;
      }
      setTapCount(0);
    }, 300);
  };

  useEffect(() => {
    const wrapper = document.querySelector(".video-wrapper");
    if (!wrapper) return;
    wrapper.addEventListener("touchend", handleTap);
    wrapper.addEventListener("click", handleTap);
    return () => {
      wrapper.removeEventListener("touchend", handleTap);
      wrapper.removeEventListener("click", handleTap);
    };
  }, [tapCount]);

  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || PLAN_LIMITS[plan].maxViewMinutes === Infinity || previewOnly) return;

    const handleTimeUpdate = () => {
      const maxSeconds = PLAN_LIMITS[plan].maxViewMinutes * 60;
      if (video.currentTime >= maxSeconds) {
        video.pause();
        setIsPlaying(false);
        setShowLimitModal(true);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [plan, previewOnly]);


  return (
    <>
      <div className="custom-video-container">
        {!previewOnly && (
          <div className="plan-badge bg-info text-white px-2 py-1 rounded">
            {plan.toUpperCase()} PLAN - {currentRes}
          </div>
        )}

        <div className="video-wrapper">
          <video
            ref={videoRef}
            className="custom-video"
            onTimeUpdate={handleProgress}
            onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
            onEnded={() => {
              setIsPlaying(false);
              onVideoEnd();
            }}
            muted={previewOnly}
            loop={previewOnly}
            playsInline
            poster={thumbnail ? normalizePath(thumbnail) : undefined}
          >
            {currentSrc && <source src={currentSrc} type="video/mp4" />}
            Your browser does not support the video tag.
          </video>

          {!previewOnly && (
            <div className="controls">
              <button onClick={togglePlay} className="control-btn">
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>

              <span className="time-label">
                <FaRegClock /> {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              <input
                type="range"
                ref={progressRef}
                className="progress-bar"
                min="0"
                max="100"
                onChange={handleSeek}
              />

              <div className="volume-control">
                <button onClick={() => setShowVolume(!showVolume)} className="control-btn">
                  <FaVolumeUp />
                </button>
                {showVolume && (
                  <input
                    type="range"
                    className="form-range volume-slider"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                  />
                )}
              </div>

              <button onClick={togglePiP} className="control-btn">
                <MdPictureInPictureAlt />
              </button>

              <button onClick={toggleFullscreen} className="control-btn">
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>

              <div className="resolution-dropdown">
                <button className="control-btn" onClick={() => setShowResMenu(!showResMenu)}>
                  <MdSettings />
                </button>
                {showResMenu && (
                  <ul className="res-options">
                    {Object.keys(resolutions).map((res) => (
                      <li
                        key={res}
                        className={res === currentRes ? "active-resolution" : ""}
                        onClick={() => handleResolutionChange(res)}
                      >
                        {res}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button onClick={handleDownload} className="control-btn">
                <FaDownload />
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal show={showDownloadModal} onHide={() => setShowDownloadModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Resolution</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {availableResolutions.map((res) => (
            <Button
              key={res}
              variant="outline-primary"
              className="m-1"
              onClick={async () => {
                setShowDownloadModal(false);
                await dispatch(downloadVideoById(videoid, res, title));
              }}
            >
              {res.toUpperCase()}
            </Button>
          ))}
        </Modal.Body>
      </Modal>
      <Modal show={showLimitModal} onHide={() => setShowLimitModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Viewing Limit Reached</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your current plan (<strong>{plan.toUpperCase()}</strong>) allows only{" "}
          {PLAN_LIMITS[plan].maxViewMinutes} minute(s) of video playback.
          <br />
          Please upgrade your plan to continue watching the full video.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLimitModal(false)}>
            Close
          </Button>
          {/* Optional: Add upgrade button or link */}
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default VideoPlayer;
