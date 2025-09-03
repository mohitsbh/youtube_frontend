import * as api from "../Api";

export const fetchThemeSuggestion = () => async (dispatch) => {
  try {
    const { data } = await api.getThemeSuggestion();
    dispatch({ type: "SET_THEME", payload: data.theme });
  } catch (error) {
    console.error("❌ Theme suggestion fetch failed:", error);
  }
};
