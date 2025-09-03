import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Leftsidebar from '../../Component/Leftsidebar/Leftsidebar';
import Showvideogrid from '../../Component/Showvideogrid/Showvideogrid';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getallvideo } from '../../action/video';

const Yourvideo = () => {
  const currentuser = useSelector((state) => state.currentuserreducer);
  const videos = useSelector((state) => state.videoreducer?.data || []);
  const dispatch = useDispatch();
  const currentUserId = currentuser?.result?._id;

  useEffect(() => {
    // Ensure we have latest videos
    if (!videos || videos.length === 0) dispatch(getallvideo());
  }, [dispatch]);

  const yourvideolist = currentUserId
    ? videos
        .filter((video) => {
          // Normalize channel and uploader IDs (they may be populated objects or strings)
          const ch = video.videochanel;
          const uploader = video.uploader;
          const chId = ch && (typeof ch === 'string' ? ch : (ch._id || ch));
          const uploaderId = uploader && (typeof uploader === 'string' ? uploader : (uploader._id || uploader));
          return String(chId) === String(currentUserId) || String(uploaderId) === String(currentUserId);
        })
        .reverse()
    : [];

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#000' }}>
      <Leftsidebar />

      <div className="flex-grow-1 p-4 text-light">
        <div className="container">
          <h2 className="mb-4">📼 Your Uploaded Videos</h2>

          {currentuser ? (
            yourvideolist.length > 0 ? (
              <Showvideogrid vid={yourvideolist} />
            ) : (
              <div className="alert alert-secondary mt-3" role="alert">
                You haven&apos;t uploaded any videos yet.
              </div>
            )
          ) : (
            <div className="alert alert-danger mt-3" role="alert">
              Please log in to view your uploaded videos.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Yourvideo;
