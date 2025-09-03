import React, { useState } from "react";
import "./Videoupload.css";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { useSelector, useDispatch } from "react-redux";
import { uploadvideo } from "../../action/video";

const Videoupload = ({ setvideouploadpage }) => {
  const [title, setTitle] = useState("");
  const [videofile, setVideofile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  const currentuser = useSelector((state) => state.currentuserreducer);

  const handleFileChange = (e) => {
    setVideofile(e.target.files[0]);
  };

  const fileoption = {
    onUploadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;
      const percent = Math.floor((loaded / total) * 100);
      setProgress(percent);
    },
  };

  const handleUpload = () => {
    if (!title.trim()) return alert("⚠️ Please enter a video title.");
    if (!videofile) return alert("⚠️ Please select a video file.");
    if (!videofile.type.startsWith("video/")) return alert("❌ Only video files are allowed.");
    if (videofile.size > 2 * 1024 * 1024 * 1024) return alert("❌ Video must be less than 2 GB.");

    const filedata = new FormData();
    filedata.append("video", videofile);
    filedata.append("title", title);
    filedata.append("chanel", currentuser?.result?._id);

    setUploading(true);

    dispatch(uploadvideo({ filedata, fileoption }))
      .then(() => {
        alert("✅ Video uploaded successfully!");
        setvideouploadpage(false);
      })
      .catch((err) => {
        alert("❌ Upload failed. Please try again.");
        console.error("Upload error:", err);
      })
      .finally(() => {
        setUploading(false);
        setProgress(0);
        setTitle("");
        setVideofile(null);
      });
  };

  const resetForm = () => {
    setTitle("");
    setVideofile(null);
    setProgress(0);
  };

  return (
    <div className="container_VidUpload">
      <input
        type="button"
        value="✖"
        onClick={() => setvideouploadpage(false)}
        className="ibtn_x"
      />

      <div className="container2_VidUpload">
        {/* 📦 Left Side: File Input */}
        <div className="ibox_div_vidupload">
          <input
            type="text"
            maxLength={60}
            placeholder="🎬 Enter video title (max 60 chars)"
            className="ibox_vidupload"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label htmlFor="file" className="ibox_cidupload btn_vidUpload">
            📂 Choose Video File
          </label>
          <input
            type="file"
            name="video"
            id="file"
            hidden
            accept="video/*"
            onChange={handleFileChange}
          />

          {videofile && (
            <>
              <p style={{ color: "#fff", marginTop: "10px" }}>
                📁 Selected: <b>{videofile.name}</b>
              </p>
              <video
                src={URL.createObjectURL(videofile)}
                controls
                width="100%"
                style={{ marginTop: "10px", borderRadius: "10px", maxHeight: "200px" }}
              />
            </>
          )}
        </div>

        {/* 🚀 Right Side: Actions */}
        <div className="ibox_div_vidupload">
          <input
            type="button"
            onClick={handleUpload}
            value={uploading ? "⏳ Uploading..." : "⬆️ Upload"}
            className="ibox_vidupload btn_vidUpload"
            disabled={uploading || !title || !videofile}
          />

          <input
            type="button"
            value="🔄 Reset"
            onClick={resetForm}
            className="ibox_vidupload btn_vidUpload"
            disabled={uploading}
          />

          {uploading && (
            <div className="loader ibox_div_vidupload" style={{ width: "100px", height: "100px" }}>
              <CircularProgressbar
                value={progress}
                text={`${progress}%`}
                styles={buildStyles({
                  rotation: 0.25,
                  strokeLinecap: "butt",
                  textSize: "20px",
                  pathTransitionDuration: 0.5,
                  pathColor: progress === 100 ? "lime" : `rgba(255, 255, 255, ${progress / 100})`,
                  textColor: "#fff",
                  trailColor: "#444",
                  backgroundColor: "#3e98c7",
                })}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Videoupload;
