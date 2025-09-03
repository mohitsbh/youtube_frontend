// src/components/ProfileDownloads.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
// import UpgradePlan from "./UpgradePlan";
import "./ProfileDownloads.css"; // ← import CSS file
import UpgradePlan from "../../Pages/Payment/UpgradePlan";

const ProfileDownloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("Profile"))?.token;
  const base ='https://youtube-backend-8hha.onrender.com';
  const res = await axios.get(`${base}/api/download/my-downloads`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDownloads(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch downloads:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDownloads();
  }, []);

  return (
    <div className="profile-downloads">
      <h2>📥 Your Downloads</h2>

      {loading ? (
        <p className="loading-text">Loading download history...</p>
      ) : downloads.length === 0 ? (
        <p className="empty-text">No videos downloaded yet.</p>
      ) : (
        downloads.map((item) => (
          <div key={item._id} className="download-item">
            <p>
              <strong>🎬 Video:</strong> {item.videoid?.title || "Untitled"}
            </p>
            <p>
              <strong>🆔 Video ID:</strong> {item.videoid?._id}
            </p>
            <p className="timestamp">🕒 {moment(item.downloadedAt).format("LLL")}</p>
          </div>
        ))
      )}

      <hr className="divider" />
      <UpgradePlan />
    </div>
  );
};

export default ProfileDownloads;
