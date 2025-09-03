import { combineReducers } from "redux";
import authreducer from "./auth";
import currentuserreducer from "./currentuser";
import chanelreducer from "./chanel";
import videoreducer from "./video";
import historyreducer from "./history";
import likedvideoreducer from "./likedvideo";
import watchlaterreducer from "./watchlater";
import groupReducer from "./group";
import messagereducer from "./messageReducer";
import paymentReducer from "./payment";
import commentreducer from "./comment";
import downloadReducer from "./download";
import themeReducer from "./theme";
import recordingReducer from "./recording";
export default combineReducers({
  authreducer,
  currentuserreducer,
  videoreducer,
  chanelreducer,
  commentreducer,
  historyreducer,
  likedvideoreducer,
  watchlaterreducer,
  groups: groupReducer,
  message: messagereducer,
  payment: paymentReducer,
  download: downloadReducer,
  theme: themeReducer,
  recording: recordingReducer,
});
