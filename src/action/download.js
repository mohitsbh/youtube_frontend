import * as api from "../Api";

// 📜 Fetch user's download history with pagination
export const getDownloadHistory =
  (page = 1, limit = 20) =>
  async (dispatch) => {
    try {
      dispatch({ type: "FETCH_DOWNLOADS_START" });
      const { data } = await api.getDownloadHistory(page, limit);
      // Server currently returns an array of downloads, not a paginated object
      const downloadsArray = Array.isArray(data) ? data : (data?.downloads || []);
      const pagination = Array.isArray(data)
        ? { page: 1, totalPages: 1, totalItems: downloadsArray.length }
        : {
            page: data.page || 1,
            totalPages: data.totalPages || 1,
            totalItems: data.totalItems || downloadsArray.length || 0,
          };

      dispatch({
        type: "FETCH_DOWNLOADS_SUCCESS",
        payload: {
          data: downloadsArray,
          pagination,
        },
      });
    } catch (error) {
      dispatch({ type: "FETCH_DOWNLOADS_ERROR", payload: error.message });
      console.error("❌ Failed to fetch download history:", error.message);
    }
  };

// 📊 Get remaining daily download count
export const getDownloadCount = () => async () => {
  try {
    const { data } = await api.getDownloadCount();
    return { success: true, data };
  } catch (error) {
    console.error("❌ Failed to fetch download count:", error.message);
    return { success: false, error: error.message };
  }
};

// 📂 Fetch available resolutions for a video
export const getAvailableResolutions = (videoid) => async (dispatch) => {
  try {
    const { data } = await api.getAvailableResolutions(videoid);
    dispatch({ type: "SET_AVAILABLE_RESOLUTIONS", payload: data.available });
    return { success: true, data };
  } catch (error) {
    console.error("❌ Failed to fetch available resolutions:", error.message);
    return { success: false, error: error.message };
  }
};

// 📥 Download video with fallback resolution logic
export const downloadVideoById =
  (videoid, preferredRes = "360p", title = "video", viewer = "") =>
  async (dispatch) => {
    dispatch({ type: "DOWNLOAD_START" });

    try {
      const res = await dispatch(getAvailableResolutions(videoid));
      const available = res?.data?.available || [];

      const tryOrder = [preferredRes, "720p", "480p", "360p"];
      const resolutionsToTry = tryOrder.filter(
        (res, index, self) =>
          available.includes(res) && self.indexOf(res) === index
      );

      if (resolutionsToTry.length === 0 && available.includes("original")) {
        resolutionsToTry.push("original");
      }

      if (resolutionsToTry.length === 0) {
        throw new Error("No available resolutions");
      }

      for (const res of resolutionsToTry) {
        try {
          const response = await api.downloadVideo(videoid, res, viewer);
          if (response?.blob) {
            const blob = response.blob;
            const url = window.URL.createObjectURL(blob);

            const safeTitle = title
              .replace(/[^\w\s-]/gi, "")
              .replace(/\s+/g, "_")
              .slice(0, 40);
            const filename = response.filename || `${safeTitle}_${res}.mp4`;

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            dispatch({
              type: "DOWNLOAD_SUCCESS",
              payload: { videoid, title, viewer, resolution: res },
            });

            // ✅ Refresh download history so it appears in library
            await dispatch(getDownloadHistory());

            return { success: true };
          }
        } catch (err) {
          console.error(`❌ Failed at resolution ${res}:`, err.message);
          if (err?.response?.status !== 404) throw err;
        }
      }

      throw new Error("No working resolution could be downloaded");
    } catch (error) {
      dispatch({ type: "DOWNLOAD_ERROR", payload: error.message });
      return {
        success: false,
        reason: "NO_RESOLUTIONS",
        error: error.message,
      };
    }
  };

// 🧹 Clear download state (e.g. on logout)
export const clearDownloadState = () => ({ type: "CLEAR_DOWNLOAD_STATE" });
