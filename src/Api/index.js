import axios from "axios";

// ✅ Base Axios instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://youtube-backend-8hha.onrender.com",
});

// ✅ Add JWT token to every request if exists
API.interceptors.request.use((req) => {
  const profile = localStorage.getItem("Profile");
  if (profile) {
    req.headers.Authorization = `Bearer ${JSON.parse(profile).token}`;
  }
  return req;
});

//
// 🟣 AUTH & USER
//
export const login = (authdata) => API.post("/user/login", authdata);
export const verifyOtp = (payload) => API.post("/user/verify-otp", payload);
export const updatechaneldata = (id, updatedata) =>
  API.patch(`/user/update/${id}`, updatedata);
export const fetchallchannel = () => API.get("/user/getallchannel");
export const getMe = () => API.get("/user/me");

//
// 🔴 VIDEO
//
export const uploadvideo = (filedata, config) =>
  API.post("/video/uploadvideo", filedata, config);
export const getvideos = () => API.get("/video/getvideos");
export const getVideoById = (id) => API.get(`/video/get/${id}`);
export const likevideo = (id, Like) => API.patch(`/video/like/${id}`, { Like });
export const viewsvideo = (id) => API.patch(`/video/view/${id}`);

//
// 🟡 COMMENT
//
export const postcomment = (commentdata) =>
  API.post("/comment/post", commentdata);
export const editcomment = (id, commentbody) =>
  API.patch(`/comment/edit/${id}`, { commentbody });
export const getallcomment = () => API.get("/comment/get");
export const likeComment = (id, body) => API.patch(`/comment/like/${id}`, body);
export const dislikeComment = (id, body) =>
  API.patch(`/comment/dislike/${id}`, body);
export const translateComment = (id, lang) =>
  API.post(`/comment/translate/${id}`, { lang });
export const deletecomment = (id) => API.delete(`/comment/delete/${id}`);

//
// 🔵 HISTORY
//
export const addtohistory = (historydata) =>
  API.post("/video/history", historydata);
export const getallhistory = () => API.get("/video/getallhistory");
export const deletehistory = (userId) =>
  API.delete(`/video/deletehistory/${userId}`);

//
// 🟢 LIKED VIDEOS
//
export const addtolikevideo = (likedvideodata) =>
  API.post("/video/likevideo", likedvideodata);
export const getalllikedvideo = () => API.get("/video/getalllikedvideo");
export const deletelikedvideo = (videoid, viewer) =>
  API.delete(`/video/deletelikevideo/${videoid}/${viewer}`);

//
// 🟠 WATCH LATER
//
export const addtowatchlater = (watchlaterdata) =>
  API.post("/video/watchlater", watchlaterdata);
export const getallwatchlater = () => API.get("/video/getallwatchlater");
export const deletewatchlater = (videoid) =>
  API.delete(`/video/deletewatchlater/${videoid}`);

//
// 📥 DOWNLOADS
//

// ✅ Pure API call to download a video file (as Blob)
export const downloadVideo = async (videoid, resolution) => {
  const response = await API.get(`/api/download/${videoid}`, {
    params: { resolution },
    responseType: "blob", // Important to receive binary data as Blob
    validateStatus: () => true, // Avoid Axios throwing on non-2xx status
  });

  if (response.status !== 200) {
    // Extract error message from response blob if possible
    let errorMsg = "Unknown error";
    try {
      const text = await response.data.text();
      const json = JSON.parse(text);
      errorMsg = json.message || errorMsg;
    } catch {
      // If parsing fails, keep default errorMsg
    }
    throw new Error(
      `Download failed with status ${response.status}: ${errorMsg}`
    );
  }

  // Default filename fallback
  let filename = "video.mp4";

  // Parse filename from Content-Disposition header if present
  const disposition = response.headers["content-disposition"];
  if (disposition) {
    const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (match?.[1]) {
      filename = match[1].replace(/['"]/g, "");
    }
  }

  return { blob: response.data, filename };
};

// ✅ Fetch remaining daily download count for current user
export const getDownloadCount = () => API.get(`/api/download/count`);

// ✅ Fetch current user's download history
export const getDownloadHistory = () => API.get("/api/download/my-downloads");

// ✅ Fetch available resolutions for a given video
export const getAvailableResolutions = (videoid) =>
  API.get(`/api/download/${videoid}/resolutions`);

//
// ⏱️ WATCH DURATION
//
export const validateWatchDuration = (videoid, watchTime) =>
  API.post("/api/watch/validate", { videoid, watchTime });

//
// 👥 GROUPS
//
export const createGroup = (groupData) =>
  API.post("/api/groups/create", groupData);
export const searchGroups = (query) =>
  API.get(`/api/groups/search`, { params: { query } });
export const getUserGroups = () => API.get("/api/groups/my-groups");
export const updateGroup = (groupId, updateData) =>
  API.put(`/api/groups/${groupId}`, updateData);
export const getGroupMessages = (groupId, before, limit = 20) =>
  API.get(`/api/messages/${groupId}`, {
    params: { before, limit },
  });

//
// 💬 MESSAGES
//
export const sendMessage = (messageData) =>
  API.post("/api/messages", messageData);
export const getMessages = (groupId) => API.get(`/api/messages/${groupId}`);
export const getLatestMessages = (groupId, limit = 20) =>
  API.get(`/api/messages/${groupId}/latest`, { params: { limit } });

//
// 💳 PAYMENT & INVOICE
//
export const createOrder = (planType, amount) =>
  API.post("/api/payment/create-order", { planType, amount });
export const verifyPayment = (paymentData) =>
  API.post("/api/payment/verify", paymentData);
export const downloadInvoice = (invoiceId) =>
  API.get(`/api/invoice/download/${invoiceId}`, {
    responseType: "blob",
  });

//
// 🌈 THEME SUGGESTION
//
export const getThemeSuggestion = () => API.get("/api/theme/suggest");

//
// 🎙️ VOIP RECORDING (WebRTC)
//
export const uploadRecording = (formData) =>
  API.post("/api/voip/record", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

//
// 🔴 LOCAL RECORDING (Optional)
//
export const uploadLocalRecording = (formData) =>
  API.post("/api/recording/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export default API;
