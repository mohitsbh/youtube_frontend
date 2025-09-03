import * as api from "../Api";

// 📩 Fetch all messages for a group
export const getMessages = (groupId) => async (dispatch) => {
  try {
    const { data } = await api.getMessages(groupId); // GET /api/messages/:groupId
    dispatch({
      type: "GET_MESSAGES_SUCCESS",
      payload: { groupId, messages: data },
    });
  } catch (error) {
    console.error(
      "Error fetching messages:",
      error?.response?.data?.message || error.message
    );
  }
};

// 📨 Send a new message in a group
export const sendMessage = (groupId, text) => async (dispatch) => {
  try {
    if (!groupId || !text?.trim()) return;

    const { data } = await api.sendMessage({ groupId, content: text.trim() });

    // Make sure we got back a valid message object
    if (!data || !data._id) {
      console.warn("⚠️ Unexpected response from sendMessage:", data);
    }

    dispatch({
      type: "SEND_MESSAGE_SUCCESS",
      payload: { groupId, message: data },
    });

    return data;
  } catch (error) {
    console.error(
      "❌ Error sending message:",
      error?.response?.data?.message || error.message
    );
  }
};
