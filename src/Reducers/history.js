const initialState = {
  data: [],
};

const historyreducer = (state = initialState, action) => {
  switch (action.type) {
    case 'POST_HISTORY':
      return { ...state, data: action.payload };
    case 'FETCH_ALL_HISTORY':
      return { ...state, data: action.payload };
    case 'ADD_HISTORY_ITEM':
      console.log("🔄 Processing ADD_HISTORY_ITEM action:", action.payload);
      // Ensure state.data is always an array before filtering
      const currentData = Array.isArray(state.data) ? state.data : [];
      // Add new history item to the beginning of the list
      const updatedHistoryState = { 
        ...state, 
        data: [action.payload, ...currentData.filter(item => 
          item?.videoid?._id !== action.payload?.videoid?._id
        )]
      };
      console.log("✅ Updated history state:", updatedHistoryState.data);
      return updatedHistoryState;
    case 'HISTORY_LOADING':
      return { ...state, loading: true };
    case 'CLEAR_HISTORY':
      return { ...state, data: [] };
    default:
      return state;
  }
};

export default historyreducer;
 
