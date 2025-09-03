import * as api from "../Api";

// ✅ Upload Video
export const uploadvideo = (videodata) => async (dispatch) => {
  try {
    const { filedata, fileoption } = videodata;
    const { data } = await api.uploadvideo(filedata, fileoption);

    // Dispatch single video to state if needed (optional)
    dispatch({ type: 'POST_VIDEO', payload: data.file });

    // Refresh full video list
    dispatch(getallvideo());
  } catch (error) {
    alert(error?.response?.data?.message || "Upload failed.");
  }
};

// ✅ Fetch All Videos
export const getallvideo = () => async (dispatch) => {
  try {
    const { data } = await api.getvideos();
    dispatch({ type: 'FETCH_ALL_VIDEOS', payload: data });
  } catch (error) {
    console.log(error);
  }
};

// ✅ Like Video
export const likevideo = (likedata) => async (dispatch) => {
  try {
    const { id, Like } = likedata;
    const { data } = await api.likevideo(id, Like);
    dispatch({ type: "POST_LIKE", payload: data });
    // dispatch(getallvideo());
  } catch (error) {
    console.log(error);
  }
};

// ✅ View Count
export const viewvideo = (viewdata) => async (dispatch) => {
  try {
    const { id } = viewdata;
    console.log("🔄 Incrementing view for video:", id);
    
    // The API call will automatically include auth token from interceptors
    const { data } = await api.viewsvideo(id);
    console.log("✅ View response:", data);
    
    // Update the video in the store with new view count
    dispatch({ type: "POST_VIEWS", data });
    
    // Optionally refresh video list to show updated view count
    // dispatch(getallvideo());
  } catch (error) {
    console.error("❌ View increment failed:", error);
    console.error("Error details:", error.response?.data || error.message);
    
    // Don't show error to user for view count failures
    // Just log it for debugging
  }
};
