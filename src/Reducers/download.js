const initialState = {
  data: [], // download history
  resolutions: [], // available resolutions
  selectedResolution: null,
  loading: false,
  error: null,
  downloadStatus: null, // "success" | "error" | null
  pagination: {
    page: 1,
    totalPages: 0,
    totalItems: 0,
  },
};

const downloadReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_DOWNLOADS_START":
    case "DOWNLOAD_START":
      return { ...state, loading: true, error: null, downloadStatus: null };

    case "FETCH_DOWNLOADS_SUCCESS":
      return {
        ...state,
        data: action.payload.data,
        pagination: action.payload.pagination || state.pagination,
        loading: false,
      };

    case "FETCH_DOWNLOADS_ERROR":
    case "DOWNLOAD_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
        downloadStatus: "error",
      };

    case "DOWNLOAD_SUCCESS":
      return {
        ...state,
        loading: false,
        downloadStatus: "success",
        data: [
          {
            videoid: action.payload.videoid,
            title: action.payload.title,
            viewer: action.payload.viewer,
            resolution: action.payload.resolution,
            downloadedAt: new Date().toISOString(),
          },
          ...state.data,
        ],
      };

    case "SET_AVAILABLE_RESOLUTIONS":
      return { ...state, resolutions: action.payload };

    case "SET_SELECTED_RESOLUTION":
      return { ...state, selectedResolution: action.payload };

    case "CLEAR_DOWNLOAD_STATE":
      return initialState;

    default:
      return state;
  }
};

export default downloadReducer;
