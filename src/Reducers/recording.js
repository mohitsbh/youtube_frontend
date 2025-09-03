const initialState = {
  loading: false,
  success: false,
  error: null,
  savedRecording: null,
};

const recordingReducer = (state = initialState, action) => {
  switch (action.type) {
    case "RECORDING_UPLOAD_REQUEST":
      return { ...state, loading: true, success: false, error: null };

    case "RECORDING_UPLOAD_SUCCESS":
      return {
        ...state,
        loading: false,
        success: true,
        savedRecording: action.payload,
      };

    case "RECORDING_UPLOAD_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "RECORDING_RESET":
      return initialState;

    default:
      return state;
  }
};

export default recordingReducer;
