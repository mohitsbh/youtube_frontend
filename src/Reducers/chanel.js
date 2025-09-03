// const channelReducer = (state = [], action) => {
//   switch (action.type) {
//     case "FETCH_CHANELS":
//       return action.payload; // Replace entire state with fetched channels

//     case "UPDATE_DATA":
//       return state.map((channel) =>
//         channel._id === action.payload._id ? action.payload : channel
//       );

//     default:
//       return state;
//   }
// };

// export default channelReducer;


const channelReducer = (state = [], action) => {
  switch (action.type) {
    case "FETCH_CHANELS":
      // Replace the entire state with fetched channels array
      return Array.isArray(action.payload) ? action.payload : state;

    case "UPDATE_DATA":
      // Update the matching channel by _id
      return state.map((channel) =>
        channel._id === action.payload._id ? action.payload : channel
      );

    default:
      return state;
  }
};

export default channelReducer;
