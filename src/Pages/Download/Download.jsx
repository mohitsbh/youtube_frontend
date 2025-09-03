import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import WHLvideolist from "../../Component/WHL/WHLvideolist";
import { getDownloadHistory } from "../../action/download";

const Download = () => {
  const dispatch = useDispatch();

  const currentuser = useSelector((state) => state.currentuserreducer);

  // Downloads state slice (reducer is combined under `download`)
  const downloadsState = useSelector((state) => state.download || {});
  const { data, loading, error } = downloadsState;

  // downloadHistory is the raw data array (of downloads)
  const downloadHistory = Array.isArray(data) ? data : [];

  // Fetch download history when user is available
  useEffect(() => {
    if (currentuser) {
      dispatch(getDownloadHistory());
    }
  }, [dispatch, currentuser]);

  const handleRetry = useCallback(() => {
    dispatch(getDownloadHistory());
  }, [dispatch]);

  if (!currentuser) {
    return (
      <div className="container bg-dark mt-4 text-light">
        <h4 className="mb-3">📥 My Downloads</h4>
        <p>Please login to view your downloads.</p>
      </div>
    );
  }

  // Pass raw downloadHistory directly — WHLvideolist handles extraction & filtering

  return (
    <div className="container bg-dark mt-4 text-light" style={{ maxWidth: "900px" }}>
      <h4 className="mb-3">📥 My Downloads</h4>

      {loading ? (
        <div className="d-flex align-items-center gap-2">
          <div
            className="spinner-border text-info"
            role="status"
            style={{ width: "1.5rem", height: "1.5rem" }}
          />
          <span>Loading downloads...</span>
        </div>
      ) : error ? (
        <div className="text-danger d-flex align-items-center flex-wrap gap-2">
          <span>⚠️ Failed to load downloads: {error}</span>
          <button
            onClick={handleRetry}
            className="btn btn-sm btn-warning"
            aria-label="Retry loading downloads"
          >
            Retry
          </button>
        </div>
      ) : downloadHistory.length > 0 ? (
        // Pass normalized user id (not the whole object) so filtering works
        <WHLvideolist
          key="download-list"
          page="Downloads"
          currentuser={currentuser?.result?._id || currentuser}
          videolist={downloadHistory}
        />
      ) : (
        <p>No videos downloaded yet.</p>
      )}
    </div>
  );
};

export default Download;
