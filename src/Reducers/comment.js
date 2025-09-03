const commentreducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case "FETCH_ALL_COMMENTS":
      return { ...state, data: action.payload };

    case "POST_COMMENT":
      // Add new comment at the beginning to show newest first
      return { ...state, data: [action.payload, ...state.data] };

    case "EDIT_COMMENT":
      return {
        ...state,
        data: state.data.map((comment) =>
          comment._id === action.payload._id ? action.payload : comment
        ),
      };

    case "DELETE_COMMENT":
      return {
        ...state,
        data: state.data.filter((comment) => comment._id !== action.payload),
      };

    case "LIKE_COMMENT":
    case "DISLIKE_COMMENT":
      return {
        ...state,
        data: state.data.map((comment) =>
          comment._id === action.payload._id ? action.payload : comment
        ),
      };

    case "TRANSLATE_COMMENT":
      return {
        ...state,
        data: state.data.map((comment) =>
          comment._id === action.payload.id
            ? {
                ...comment,
                translations: {
                  ...(comment.translations || {}),
                  [action.payload.language]: action.payload.translatedText,
                },
              }
            : comment
        ),
      };

    default:
      return state;
  }
};

export default commentreducer;
