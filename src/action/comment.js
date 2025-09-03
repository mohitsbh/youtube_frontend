import * as api from "../Api";

// Post a Comment
export const postcomment = (commentdata) => async (dispatch) => {
  try {
    const { data } = await api.postcomment(commentdata);
    dispatch({ type: "POST_COMMENT", payload: data });
    dispatch(getallcomment()); // Refresh comments list (optional, depends on your UI logic)
  } catch (error) {
    console.error("❌ Error posting comment:", error);
  }
};

// Get All Comments
export const getallcomment = () => async (dispatch) => {
  try {
    const { data } = await api.getallcomment();
    dispatch({ type: "FETCH_ALL_COMMENTS", payload: data });
  } catch (error) {
    console.error("❌ Error fetching comments:", error);
  }
};

// Edit a Comment
export const editcomment = ({ id, commentbody }) => async (dispatch) => {
  try {
    const { data } = await api.editcomment(id, commentbody);
    dispatch({ type: "EDIT_COMMENT", payload: data });
  } catch (error) {
    console.error("❌ Error editing comment:", error);
  }
};

// Delete a Comment
export const deletecomment = (id) => async (dispatch) => {
  try {
    await api.deletecomment(id);
    dispatch({ type: "DELETE_COMMENT", payload: id });
  } catch (error) {
    console.error("❌ Error deleting comment:", error);
  }
};

// Like a Comment
export const likeComment = (id, userId) => async (dispatch) => {
  try {
    const { data } = await api.likeComment(id, { userId });
    dispatch({ type: "LIKE_COMMENT", payload: data });
  } catch (error) {
    console.error("❌ Error liking comment:", error);
  }
};

// Dislike a Comment (auto-delete if dislikes ≥ 2)
export const dislikeComment = (id, userId) => async (dispatch) => {
  try {
    const { data } = await api.dislikeComment(id, { userId });

    if (data.deleted) {
      dispatch({ type: "DELETE_COMMENT", payload: id });
    } else {
      dispatch({ type: "DISLIKE_COMMENT", payload: data });
    }
  } catch (error) {
    console.error("❌ Error disliking comment:", error);
  }
};

// Translate a Comment
export const translateComment = (id, language) => async (dispatch, getState) => {
  try {
    const state = getState();
    const comment = state.commentreducer.data.find((c) => c._id === id);
    if (!comment) return;

    const { data } = await api.translateComment(id, language);

    dispatch({
      type: "TRANSLATE_COMMENT",
      payload: {
        id,
        language,
        translatedText: data.translatedText || data.translated,
      },
    });
  } catch (error) {
    console.error("❌ Error translating comment:", error);
  }
};
