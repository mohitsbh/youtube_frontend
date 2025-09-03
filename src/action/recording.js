import * as api from "../Api";

export const uploadRecording = (file) => async (dispatch) => {
  try {
    dispatch({ type: "RECORDING_UPLOAD_REQUEST" });

    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.uploadRecording(formData);
    dispatch({ type: "RECORDING_UPLOAD_SUCCESS", payload: data });
  } catch (error) {
    dispatch({
      type: "RECORDING_UPLOAD_FAIL",
      payload: error.response?.data?.message || error.message,
    });
  }
};
