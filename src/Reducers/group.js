const initialState = {
  userGroups: [],
  allGroups: [],
};

const groupReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_GROUP":
      // Add new group to user's groups
      return { ...state, userGroups: [...state.userGroups, action.payload] };

    case "FETCH_USER_GROUPS_SUCCESS":
      // Replace user groups with fetched groups
      return { ...state, userGroups: action.payload };

    case "SET_GROUPS":
      // Set all available groups (search results or public groups)
      return { ...state, allGroups: action.payload };
    case "UPDATE_GROUP":
      return {
        ...state,
        userGroups: state.userGroups.map((group) =>
          group._id === action.payload._id ? action.payload : group
        ),
      };
    case "DELETE_GROUP":
      return {
        ...state,
        userGroups: state.userGroups.filter(
          (group) => group._id !== action.payload
        ),
      };

    case "CLEAR_GROUPS":
      return initialState;

    default:
      return state;
  }
};

export default groupReducer;
