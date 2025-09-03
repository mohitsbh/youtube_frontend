const authReducer = (state = { result: null, token: null }, action) => {
  switch (action.type) {
    case "AUTH":
      if (action.data) {
        localStorage.setItem("Profile", JSON.stringify(action.data));
      }
      return {
        ...state,
        result: action.data?.result || null,
        token: action.data?.token || null,
      };

    case "SET_CURRENT_USER":
      return {
        ...state,
        result: action.data?.result || null,
        token: action.data?.token || state.token,
      };

    case "LOGOUT":
      localStorage.removeItem("Profile");
      return { result: null, token: null };

    default:
      return state;
  }
};

export default authReducer;
