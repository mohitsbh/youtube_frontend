import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "./SearchResult.css"
const SearchResult = () => {
  const { query } = useParams();
  const videos = useSelector(state => state?.videoreducer?.data || []);

  const filteredVideos = videos.filter(video =>
    video.videotitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-results-page">
      <h2 style={{ color: 'white', margin: '1rem' }}>
        Search Results for "{query}"
      </h2>
      {filteredVideos.length === 0 ? (
        <p style={{ color: 'white', marginLeft: '1rem' }}>No videos found.</p>
      ) : (
        <div className="video-grid">
          {filteredVideos.map(video => {
            const baseURL = process.env.REACT_APP_API_URL || 'https://youtube-backend-8hha.onrender.com';
            const thumb = (video.thumbnail || video.thumbnailPath || 'default.jpg').toString().replace(/^uploads[\\/]/, '');
            const thumbUrl = thumb === 'default.jpg' ? `/uploads/default.jpg` : `${baseURL}/uploads/${encodeURI(thumb)}`;
            return (
              <div key={video._id} className="video-card">
                <img
                  src={thumbUrl}
                  alt={video.videotitle}
                  className="video-thumbnail"
                />
                <p className="video-title">{video.videotitle}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchResult;
