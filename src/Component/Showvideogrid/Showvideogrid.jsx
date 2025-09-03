import React from "react";
import "./Showvideogrid.css";
import Showvideo from "../Showvideo/Showvideo";

const Showvideogrid = ({ vid = [], reverse = true }) => {
  const videosToShow = reverse ? [...vid].reverse() : vid;

  return (
    <div className="Container_ShowVideoGrid">
      {videosToShow.length === 0 ? (
        <div className="no-videos">🚫 No videos found</div>
      ) : (
        videosToShow.map((vi) => (
          <div key={vi._id} className="video_box_app">
            <Showvideo vid={vi} />
          </div>
        ))
      )}
    </div>
  );
};

export default Showvideogrid;