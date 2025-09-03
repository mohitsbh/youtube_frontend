import React, { useState } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Showvideo = ({ vid }) => {
  const [resolution, setResolution] = useState('360p');
  const [downloading, setDownloading] = useState(false);

  const availableResolutions = Object.keys(vid.resolutions || {});
  const currentResPath =
    vid?.resolutions?.[resolution] ||
    vid?.resolutions?.['360p'] ||
    vid?.filepath;

  // Base server URL for media (no trailing slash)
  const baseURL ='https://yourtube-wtq4.onrender.com';

  // Remove "uploads/" prefix if present
  const relativeVideoPath = currentResPath?.replace(/^uploads[\\/]/, '');
  const relativeThumbPath = vid?.thumbnail?.replace(/^uploads[\\/]/, '');

  return (
    <div className="card mb-2 bg-dark text-light shadow-sm" style={{ maxWidth: '320px' }}>
      <Link to={`/videopage/${vid._id}`} className="text-decoration-none">
        <div className="position-relative">
          {/* ✅ Thumbnail with fallback to preview video */}
          {relativeThumbPath ? (
            <img
              src={`${baseURL}/uploads/${encodeURI(relativeThumbPath)}`}
              alt="Video thumbnail"
              className="w-100 rounded-top"
              style={{ height: '180px', objectFit: 'cover' }}
              onError={(e) => {
                console.warn('Thumbnail failed:', e.target.src);
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <video
              src={`${baseURL}/uploads/${encodeURI(relativeVideoPath)}`}
              className="w-100 rounded-top"
              muted
              loop
              playsInline
              preload="metadata"
              style={{ height: '180px', objectFit: 'cover' }}
              onError={(e) => {
                console.warn('Preview video failed:', e.target.src);
                e.target.style.display = 'none';
              }}
            />
          )}

          {/* 🎚️ Resolution Badges */}
          <div className="position-absolute top-0 start-0 p-2 d-flex flex-wrap gap-2">
            {['360p', '480p', '720p', '1080p'].map((res) =>
              availableResolutions.includes(res) ? (
                <span
                  key={res}
                  className={`badge bg-${resolution === res ? 'primary' : 'secondary'} ${downloading ? 'opacity-50' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!downloading) setResolution(res);
                  }}
                >
                  {res}
                </span>
              ) : null
            )}
          </div>
        </div>
      </Link>

      {/* 📄 Metadata */}
      <div className="d-flex align-items-start p-2">
        <div className="me-2">
          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
            style={{ width: '36px', height: '36px', fontSize: '16px' }}
          >
            {(() => {
              // derive a safe display name from uploader info
              const uploader = vid?.uploader;
              let displayName = '';
              if (typeof uploader === 'object') {
                displayName = uploader?.name || uploader?.username || uploader?.displayName || '';
              } else if (typeof uploader === 'string') {
                // if uploader is a string id, don't show the id; fallback to first letter of videotitle
                displayName = '';
              }
              if (!displayName) displayName = vid?.videotitle?.charAt(0) || '?';
              return (displayName?.charAt(0) || '?').toUpperCase();
            })()}
          </div>
        </div>
        <div className="flex-grow-1">
          <h6 className="mb-1 text-white text-truncate" title={vid?.videotitle}>
            {vid?.videotitle}
          </h6>
          <p className="mb-0 text-white small">
            {(() => {
              const uploader = vid?.uploader;
              if (typeof uploader === 'object') return uploader?.name || uploader?.username || 'Unknown';
              if (typeof uploader === 'string') return 'Unknown'; // avoid showing raw id string
              return vid?.uploaderName || vid?.uploader || 'Unknown';
            })()}
          </p>
          <p className="mb-0 text-white small">
            {(typeof vid?.views === 'number' ? vid.views : vid?.viewCount || vid?.viewsCount || 0)} views • {moment(vid?.createdAt).fromNow()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Showvideo;
