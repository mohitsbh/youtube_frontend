// import * as api from "../Api";

// // ❤️ Add video to liked list
// export const addtolikedvideo = (likedVideoData) => async (dispatch) => {
//   try {
//     const { data } = await api.addtolikevideo(likedVideoData);
//     dispatch({ type: "POST_LIKEDVIDEO", payload: data });
//     dispatch(getalllikedvideo()); // Refresh after adding
//   } catch (error) {
//     console.error("❌ Error adding to liked videos:", error.message);
//   }
// };

// // 📄 Fetch all liked videos
// export const getalllikedvideo = () => async (dispatch) => {
//   try {
//     const { data } = await api.getalllikedvideo();
//     dispatch({ type: "FETCH_ALL_LIKED_VIDEOS", payload: data });
//   } catch (error) {
//     console.error("❌ Error fetching liked videos:", error.message);
//   }
// };

// // ❌ Remove video from liked list
// export const deletelikedvideo = ({ videoid, viewer }) => async (dispatch) => {
//   try {
//     await api.deletelikedvideo(videoid, viewer);
//     dispatch(getalllikedvideo()); // Refresh after delete
//   } catch (error) {
//     console.error("❌ Error deleting liked video:", error.message);
//   }
// };


import * as api from "../Api";
import { toast } from "react-toastify";

// ❤️ Add a video to liked list
export const addtolikedvideo = (likedVideoData) => async (dispatch) => {
  try {
    console.log("🔄 Adding to liked videos:", likedVideoData);
    const { data } = await api.addtolikevideo(likedVideoData);
    console.log("✅ Server response:", data);
    dispatch({ type: "POST_LIKEDVIDEO", payload: data });
    dispatch(getalllikedvideo()); // Refresh
    toast.success("✅ Added to liked videos");
    return { success: true, data };
  } catch (error) {
    console.error("❌ Full error object:", error);
    console.error("❌ Error response:", error?.response);
    
    let msg = "❌ Failed to like video";
    const status = error?.response?.status;
    if (status === 409) {
      msg = error.response.data?.message || "You already liked this video";
      console.warn("⚠️ Duplicate like attempt:", msg);
      toast.info(msg);
      return { success: false, alreadyLiked: true, message: msg };
    }
    if (error?.response?.data?.message) {
      msg = error.response.data.message;
    } else if (error?.message) {
      msg = error.message;
    }

    console.error("❌ Error adding to liked videos:", msg);
    toast.error(msg);
  return { success: false, error: msg };
  }
};

// 📄 Fetch all liked videos
export const getalllikedvideo = () => async (dispatch) => {
  try {
    const { data } = await api.getalllikedvideo();
    dispatch({ type: "FETCH_ALL_LIKED_VIDEOS", payload: data });
  } catch (error) {
    const msg = error?.response?.data?.message || "❌ Failed to fetch liked videos";
    console.error("❌ Error fetching liked videos:", msg);
    toast.error(msg);
  }
};

// ❌ Remove a video from liked list
export const deletelikedvideo = ({ videoid, viewer }) => async (dispatch) => {
  try {
    await api.deletelikedvideo(videoid, viewer);
  dispatch(getalllikedvideo()); // Refresh
  toast.success("🗑️ Removed from liked videos");
  return { success: true };
  } catch (error) {
    const msg = error?.response?.data?.message || "❌ Failed to remove liked video";
    console.error("❌ Error deleting liked video:", msg);
    toast.error(msg);
  return { success: false, error: msg };
  }
};
