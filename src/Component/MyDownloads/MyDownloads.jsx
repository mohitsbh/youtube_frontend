// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import moment from 'moment';

// const MyDownloads = () => {
//   const [downloads, setDownloads] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDownloads = async () => {
//       try {
//         const token = JSON.parse(localStorage.getItem("Profile"))?.token;
//         if (!token) return;

//         const res = await axios.get((process.env.REACT_APP_API_URL || 'https://youtube-backend-8hha.onrender.com') + "/api/download/my-downloads", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setDownloads(res.data);
//       } catch (err) {
//         console.error("❌ Failed to fetch downloads:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDownloads();
//   }, []);

//   return (
//     <div className="container text-light mt-5">
//       <h2 className="mb-4">📥 My Downloaded Videos</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : downloads.length === 0 ? (
//         <p className="text-muted">No downloads yet.</p>
//       ) : (
//         downloads.map((item, idx) =>
//           item.videoid ? (
//             <div
//               key={idx}
//               className="bg-dark p-3 rounded mb-4 shadow-sm border border-secondary"
//             >
//               <h5>{item.videoid.title || item.videoid.videotitle || "Untitled Video"}</h5>
//               <p className="small text-muted mb-2">
//                 ⬇ Downloaded on: {moment(item.downloadedAt).format("LLLL")} &nbsp;|&nbsp;
//                 🎞 Resolution: <strong>{item.resolution || "360p"}</strong>
//               </p>

//               <video
//                 controls
//                 width="100%"
//                 poster="https://via.placeholder.com/640x360?text=Loading..."
//                 src={
//                   item.videoid.resolutions?.[item.resolution || "360p"] ||
//                   item.videoid.filepath
//                 }
//                 onError={(e) => {
//                   e.target.src = "";
//                   e.target.poster =
//                     "https://via.placeholder.com/640x360?text=Video+Unavailable";
//                   e.target.controls = false;
//                 }}
//               />

//               {/* Optional: Download Again Button */}
//               <a
//                 href={`${(process.env.REACT_APP_API_URL || 'https://youtube-backend-8hha.onrender.com')}/api/download/${item.videoid._id}?res=${item.resolution || "360p"}`}
//                 className="btn btn-outline-light mt-3"
//               >
//                 ⬇ Download Again
//               </a>
//             </div>
//           ) : (
//             <div key={idx} className="alert alert-warning">
//               ⚠️ This video is no longer available.
//             </div>
//           )
//         )
//       )}
//     </div>
//   );
// };

// export default MyDownloads;


// src/Component/MyDownloads/MyDownloads.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { getDownloadHistory, downloadVideoById } from '../../action/download';

const MyDownloads = () => {
  const dispatch = useDispatch();
  const downloadsState = useSelector((state) => state.download);
  const downloads = Array.isArray(downloadsState?.data) ? downloadsState.data : [];
  const loading = downloadsState?.loading;

  useEffect(() => {
    dispatch(getDownloadHistory());
  }, [dispatch]);

  const handleDownloadAgain = async (videoid, title) => {
    try {
      const result = await dispatch(downloadVideoById(videoid, '360p', title));

      if (result?.status === 403) {
        const upgrade = window.confirm("⚠️ Daily download limit reached. Upgrade to Premium?");
        if (upgrade) window.location.href = "/upgrade";
        return;
      }
      // downloadVideoById already triggers the browser download
    } catch (err) {
      console.error("❌ Failed to re-download:", err);
      alert("Download failed. Please try again later.");
    }
  };

  return (
    <div className="container text-light mt-5">
      <h2 className="mb-4">📥 My Downloaded Videos</h2>

      {loading ? (
        <p>Loading...</p>
      ) : downloads.length === 0 ? (
        <p className="text-muted">No downloads yet.</p>
      ) : (
        downloads.map((item, idx) =>
          item.videoid ? (
            <div key={idx} className="bg-dark p-3 rounded mb-4 shadow-sm border border-secondary">
              <h5>{item.videoid.title || item.videoid.videotitle || "Untitled Video"}</h5>
              <p className="small text-muted mb-2">
                ⬇ Downloaded on: {moment(item.downloadedAt).format("LLLL")}
              </p>

              <video
                controls
                width="100%"
                poster="https://via.placeholder.com/640x360?text=Loading..."
                src={`${('https://yourtube-wtq4.onrender.com')}/uploads/${item.videoid.resolutions?.['360p'] || item.videoid.filepath}`}
                onError={(e) => {
                  e.target.src = "";
                  e.target.poster = "https://via.placeholder.com/640x360?text=Video+Unavailable";
                  e.target.controls = false;
                }}
              />

              <button
                onClick={() => handleDownloadAgain(item.videoid._id, item.videoid.title || item.videoid.videotitle)}
                className="btn btn-outline-light mt-3"
              >
                ⬇ Download Again
              </button>
            </div>
          ) : (
            <div key={idx} className="alert alert-warning">
              ⚠️ This video is no longer available.
            </div>
          )
        )
      )}
    </div>
  );
};

export default MyDownloads;
