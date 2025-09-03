const initialState = {
  groupMessages: {},
};

const messagereducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_MESSAGES_SUCCESS": {
      const { groupId, messages } = action.payload;
      return {
        ...state,
        groupMessages: {
          ...state.groupMessages,
          [groupId]: messages,
        },
      };
    }

    case "SEND_MESSAGE_SUCCESS": {
      const { groupId, message } = action.payload;
      const existing = state.groupMessages[groupId] || [];

      // Prevent duplicate
      if (existing.some(msg => msg._id === message._id)) {
        return state;
      }

      return {
        ...state,
        groupMessages: {
          ...state.groupMessages,
          [groupId]: [...existing, message],
        },
      };
    }

    default:
      return state;
  }
};

export default messagereducer;
