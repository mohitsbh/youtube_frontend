// import * as api from "../Api";

// export const fetchallchannel=()=>async(dispatch)=>{
//     try {
//         const {data}=await api.fetchallchannel();
//         dispatch({type:"FETCH_CHANELS",payload:data})
//     } catch (error) {
//         console.log(error)
//     }
// }

// export const updatechaneldata=(id,updatedata)=>async(dispatch)=>{
//     try {
//         const {data}=await api.updatechaneldata(id,updatedata);
//         dispatch({type:"UPDATE_DATA",payload:data})
//     } catch (error) {
//         console.log(error)
//     }
// }

import * as api from "../Api";
import { toast } from "react-toastify";

// 📺 Fetch all channels
export const fetchallchannel = () => async (dispatch) => {
  try {
    const { data } = await api.fetchallchannel();
    dispatch({ type: "FETCH_CHANELS", payload: data });
  } catch (error) {
    console.error("❌ Failed to fetch channels:", error.message);
    toast.error("Failed to load channels.");
  }
};

export const updatechaneldata = (id, updateData) => async (dispatch) => {
  try {
    const { data } = await api.updatechaneldata(id, updateData);
    dispatch({ type: "UPDATE_DATA", payload: data });
    toast.success("✅ Channel updated successfully.");
    return data; // Optional: useful for chaining
  } catch (error) {
    console.error("❌ Channel update failed:", error?.message || error);
    toast.error("Channel update failed.");
  }
};
export const getMe = () => async (dispatch) => {
  try {
    const { data } = await api.getMe();
    dispatch({ type: "GET_ME", payload: data });
  } catch (error) {
    console.error("❌ Failed to fetch user data:", error.message);
    toast.error("Failed to load user data.");
  }
};