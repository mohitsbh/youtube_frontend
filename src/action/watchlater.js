// import * as api from "../Api";

// // ➕ Add to Watch Later
// export const addtowatchlater = (watchLaterData) => async (dispatch) => {
//   try {
//     const { data } = await api.addtowatchlater(watchLaterData);
//     dispatch({ type: "POST_WATCHLATER", payload: data });
//     dispatch(getallwatchlater());
//   } catch (error) {
//     console.error("❌ Error adding to Watch Later:", error.message);
//   }
// };

// // 📥 Get all Watch Later videos
// export const getallwatchlater = () => async (dispatch) => {
//   try {
//     const { data } = await api.getallwatchlater();
//     dispatch({ type: "FETCH_ALL_WATCHLATER", payload: data });
//   } catch (error) {
//     console.error("❌ Error fetching Watch Later list:", error.message);
//   }
// };

// // ❌ Remove video from Watch Later
// export const deletewatchlater = ({ videoid, viewer }) => async (dispatch) => {
//   try {
//     await api.deletewatchlater(videoid, viewer);
//     dispatch(getallwatchlater());
//   } catch (error) {
//     console.error("❌ Error deleting from Watch Later:", error.message);
//   }
// };


import * as api from "../Api";

// ➕ Add to Watch Later
export const addtowatchlater = (watchLaterData) => async (dispatch) => {
  try {
    const { data } = await api.addtowatchlater(watchLaterData);
    dispatch({ type: "POST_WATCHLATER", payload: data });
    dispatch(getallwatchlater()); // Refresh list after adding
  } catch (error) {
    console.error("❌ Failed to add to Watch Later:", error?.response?.data || error.message);
  }
};

// 📥 Fetch all Watch Later videos
export const getallwatchlater = () => async (dispatch) => {
  try {
    const { data } = await api.getallwatchlater();
    dispatch({ type: "FETCH_ALL_WATCHLATER", payload: data });
  } catch (error) {
    console.error("❌ Failed to fetch Watch Later list:", error?.response?.data || error.message);
  }
};

// ❌ Remove a video from Watch Later
export const deletewatchlater = ({ videoid, viewer }) => async (dispatch) => {
  try {
    await api.deletewatchlater(videoid, viewer);
    dispatch(getallwatchlater()); // Refresh list after deletion
  } catch (error) {
    console.error("❌ Failed to remove from Watch Later:", error?.response?.data || error.message);
  }
};
