// const initialState = {
//   data: [],
//   loading: false,
// };

// const videoreducer = (state = initialState, action) => {
//   switch (action.type) {
//     case "VIDEO_UPLOAD_START":
//       return { ...state, loading: true };

//     case "VIDEO_UPLOAD_END":
//       return { ...state, loading: false };

//     case "POST_VIDEO":
//       return {
//         ...state,
//         data: [action.data, ...(state.data || [])], // ✅ no more title bugs
//       };

//     case "FETCH_ALL_VIDEOS":
//       return { ...state, data: action.payload };

//     case "POST_LIKE":
//       return {
//         ...state,
//         data: state.data.map((video) =>
//           video._id === action.payload._id ? action.payload : video
//         ),
//       };

//     case "POST_VIEWS":
//       return {
//         ...state,
//         data: state.data.map((video) =>
//           video._id === action.data._id ? action.data : video
//         ),
//       };

//     default:
//       return state;
//   }
// };

// export default videoreducer;

const initialState = {
  data: [],
  loading: false,
};

const videoreducer = (state = initialState, action) => {
  switch (action.type) {
    case "VIDEO_UPLOAD_START":
      return { ...state, loading: true };

    case "VIDEO_UPLOAD_END":
      return { ...state, loading: false };

    case "POST_VIDEO":
      return {
        ...state,
        data: [action.payload, ...(state.data || [])], // prepend new video
      };

    case "FETCH_ALL_VIDEOS":
      return { ...state, data: action.payload };

    case "POST_LIKE":
      return {
        ...state,
        data: state.data.map((video) =>
          video._id === action.payload._id 
            ? { ...video, Like: action.payload.Like } 
            : video
        ),
      };

    case "POST_VIEWS":
      console.log("🔄 Processing POST_VIEWS action:", action.data);
      if (!action.data || !action.data.videoid) {
        console.warn("⚠️ Invalid view data:", action.data);
        return state;
      }
      const updatedState = {
        ...state,
        data: state.data.map((video) =>
          video._id === action.data.videoid 
            ? { ...video, views: action.data.views } 
            : video
        ),
      };
      console.log("✅ Updated video state:", updatedState.data.find(v => v._id === action.data.videoid));
      return updatedState;
    case "SET_AVAILABLE_RESOLUTIONS":
      return { ...state, resolutions: action.payload };

    default:
      return state;
  }
};

export default videoreducer;
