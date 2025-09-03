import React, { useEffect, useRef } from 'react';
// import './Videopage.css';
import moment from 'moment';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Likewatchlatersavebtns from './Likewatchlatersavebtns';
import Comment from '../../Component/Comment/Comment';
import VideoPlayer from '../../Component/VideoPlayer/VideoPlayer';
import Showvideo from '../../Component/Showvideo/Showvideo'; // ✅ import

import { viewvideo } from '../../action/video';
import { addtohistory } from '../../action/history';

const Videopage = () => {
  const { vid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasViewed = useRef(false);

  const vids = useSelector((state) => state.videoreducer);
  const currentuser = useSelector((state) => state.currentuserreducer);

  const currentVideo = vids?.data?.find((v) => v._id === vid);
  const allVideos = vids?.data || [];

  useEffect(() => {
    if (currentuser?.result?._id) {
      dispatch(addtohistory({ videoid: vid, viewer: currentuser.result._id }));
    }
    
    // Only increment view count once per video visit
    if (!hasViewed.current) {
      dispatch(viewvideo({ id: vid }));
      hasViewed.current = true;
    }
    
    window.scrollTo(0, 0);
  }, [vid, currentuser, dispatch]);

  const playNextVideo = () => {
    const index = allVideos.findIndex((v) => v._id === vid);
    const next = allVideos[index + 1];
    if (next) {
      navigate(`/videopage/${next._id}`);
    } else {
      alert("🎉 You've reached the last video.");
    }
  };

  if (!currentVideo) {
    return <p className="text-center text-light mt-5">Loading video...</p>;
  }

  // 🧠 Generate proper video source
  const baseURL = process.env.REACT_APP_API_URL || "https://youtube-backend-8hha.onrender.com";
  const videoPath = currentVideo?.resolutions?.['720p'] || currentVideo?.filepath || "";
  const videoSrc = videoPath.startsWith('uploads/')
    ? `${baseURL}/${videoPath}`
    : `${baseURL}/uploads/${videoPath}`;

  return (
    <div className="container-fluid bg-dark text-light py-3 min-vh-100">
      {/* <button className="btn btn-outline-light mb-3" onClick={() => navigate('/')}>
        ⬅ Back to Home
      </button> */}

      <div className="row">
        {/* 🎥 Main Video Section */}
        <div className="col-12 col-md-8 mb-4">
          <div className="p-2 rounded">
            <VideoPlayer
              key={vid}
              videoid={currentVideo._id}
              src={videoSrc}
              resolutions={currentVideo?.resolutions}
              title={currentVideo?.videotitle}
              onVideoEnd={playNextVideo}
            />
          </div>

          <h4 className="mt-3">{currentVideo?.videotitle}</h4>
          <div className="d-flex justify-content-between small text-light">
            <div>
              {currentVideo?.views} views • {moment(currentVideo?.createdAt).fromNow()}
            </div>
            <Likewatchlatersavebtns vv={currentVideo} vid={vid} />
          </div>

          {/* 👤 Channel Info */}
          <Link
            to={`/channel/${currentVideo?.uploader?._id || ''}`}
            className="d-flex align-items-center mt-3 text-decoration-none text-white border-bottom pb-2"
          >
            <div
              className="bg-white text-dark rounded-circle d-flex justify-content-center align-items-center"
              style={{ width: '3rem', height: '3rem' }}
            >
              <strong>{currentVideo?.uploader?.name?.charAt(0).toUpperCase() || '?'}</strong>
            </div>
            <span className="ms-3 fw-bold">{currentVideo?.uploader?.name || currentVideo?.uploader}</span>
          </Link>

          {/* 💬 Comments */}
          <div id="comments" className="mt-4">
            <h5><u>Comments</u></h5>
            <Comment videoid={currentVideo._id} canTranslate={true} />
          </div>
        </div>

        {/* 📺 More Videos */}
        <div className="col-12 col-md-4">
          <h5 className="mb-3">More Videos</h5>
          <div className="d-flex flex-column gap-3" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            {allVideos
              .filter((video) => video._id !== vid)
              .map((video) => (
                <Showvideo key={video._id} vid={video} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Videopage;
