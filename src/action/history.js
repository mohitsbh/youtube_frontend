import * as api from "../Api";
import { toast } from "react-toastify";

// 🕘 Add video to watch history (avoids duplicates)
export const addtohistory = (historydata) => async (dispatch) => {
  try {
    console.log("🔄 Adding to history:", historydata);
    dispatch({ type: "HISTORY_LOADING" });

    const { data } = await api.addtohistory(historydata);
    console.log("✅ Server response:", data);

    dispatch({ type: "POST_HISTORY", payload: data });

    // ✅ Option A: Instead of refreshing entire list, you could append data directly
    dispatch({ type: "ADD_HISTORY_ITEM", payload: data });

    toast.success("✅ Added to history");
  } catch (error) {
    console.error("❌ Full error object:", error);
    console.error("❌ Error response:", error?.response);
    
    let msg = "❌ Failed to add to history";
    if (error?.response?.data?.message) {
      msg = error.response.data.message;
    } else if (error?.message) {
      msg = error.message;
    }
    
    console.error("❌ Error adding to history:", msg);
    toast.dismiss();
    toast.error(msg);
  }
};

// 📄 Fetch all history
export const getallhistory = () => async (dispatch) => {
  try {
    dispatch({ type: "HISTORY_LOADING" });

    const { data } = await api.getallhistory();
    dispatch({ type: "FETCH_ALL_HISTORY", payload: data });
  } catch (error) {
    const msg = error?.response?.data?.message || "❌ Failed to fetch history";
    console.error("❌ Error fetching history:", msg);
    toast.dismiss();
    toast.error(msg);
  }
};

// 🗑️ Clear user’s entire history
export const clearhistory = (userId) => async (dispatch) => {
  try {
    if (!userId) {
      toast.error("⚠️ Missing user ID");
      return;
    }

    dispatch({ type: "HISTORY_LOADING" });

    await api.deletehistory(userId);
    dispatch({ type: "CLEAR_HISTORY" });
    toast.dismiss();
    toast.success("✅ History cleared");
  } catch (error) {
    const msg = error?.response?.data?.message || "❌ Failed to clear history";
    console.error("❌ Error clearing history:", msg);
    toast.dismiss();
    toast.error(msg);
  }
};
