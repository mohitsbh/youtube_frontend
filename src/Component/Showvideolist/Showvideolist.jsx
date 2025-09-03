import React from "react";
import Showvideo from "../Showvideo/Showvideo";
import "./Showvideogrid.css";

const Showvideolist = ({ video }) => {
  if (!video || !video._id) {
    return (
      <p style={{ textAlign: "center", padding: "1rem" }}>
        Video not found.
      </p>
    );
  }

  return (
    <div className="Container_ShowVideoGrid">
      <div className="video_box_app" key={video._id}>
        <Showvideo vid={video} />
      </div>
    </div>
  );
};

export default Showvideolist;
