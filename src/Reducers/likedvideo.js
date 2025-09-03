// const initialState = {
//   data: [],
// };

// const likedvideoreducer = (state = initialState, action) => {
//   switch (action.type) {
//     case "POST_LIKEDVIDEO":
//       // If POST_LIKEDVIDEO returns a new liked video, append it
//       return { ...state, data: [...state.data, action.payload] };
//     case "FETCH_ALL_LIKED_VIDEOS":
//       return { ...state, data: action.payload };
//     default:
//       return state;
//   }
// };

// export default likedvideoreducer;


const initialState = {
  data: [],
};

const likedvideoreducer = (state = initialState, action) => {
  switch (action.type) {
    case "POST_LIKEDVIDEO":
      console.log("🔄 Processing POST_LIKEDVIDEO action:", action.payload);
      // Add new liked video to the beginning of the list
      const updatedState = { 
        ...state, 
        data: [action.payload, ...state.data.filter(item => 
          item._id !== action.payload._id
        )]
      };
      console.log("✅ Updated liked video state:", updatedState.data);
      return updatedState;

    case "FETCH_ALL_LIKED_VIDEOS":
      return { ...state, data: action.payload };

    case "DELETE_LIKEDVIDEO":
      return {
        ...state,
        data: state.data.filter(video => video._id !== action.payload),
      };

    default:
      return state;
  }
};

export default likedvideoreducer;
