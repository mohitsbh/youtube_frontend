// const watchlaterreducer = (state = { data: [] }, action) => {
//   switch (action.type) {
//     case "POST_WATCHLATER":
//       // Assuming action.data is the new item or full updated list
//       return { ...state, data: action.data };
//     case "FETCH_ALL_WATCHLATER":
//       return { ...state, data: action.payload };
//     default:
//       return state;
//   }
// };
// export default watchlaterreducer;

const initialState = {
  data: [],
};

const watchlaterreducer = (state = initialState, action) => {
  switch (action.type) {
    case "POST_WATCHLATER":
      // Add new watch later item to the beginning of the list
      return { 
        ...state, 
        data: [action.payload, ...state.data.filter(item => 
          item._id !== action.payload._id
        )]
      };
    case "FETCH_ALL_WATCHLATER":
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

export default watchlaterreducer;
