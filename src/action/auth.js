import * as api from "../Api";
import setcurrentuser from "./currentuser"; // 🛠️ Make sure it's a named export

// 🔐 Login Action
export const login = (authdata) => async (dispatch) => {
  try {
    // Try to get region from IP service before sending login
    let region = "";
    try {
      const resp = await fetch("https://ipinfo.io/json?token=7abed5542cb821");
      const j = await resp.json();
      region = j.region || "";
    } catch (e) {
      region = "";
    }

    const { data } = await api.login({ ...authdata, region });

    // Return server response to caller so UI can open OTP modal if needed
    // Still persist to local storage and update redux
    try {
      localStorage.setItem("Profile", JSON.stringify(data));
      dispatch(setcurrentuser(data));
    } catch (e) {
      // ignore storage errors
    }

    // Apply theme suggested by server/region/time logic
    try {
      const hour = new Date().getHours();
      const SOUTH_STATES = [
        "Tamil Nadu",
        "Kerala",
        "Karnataka",
        "Andhra Pradesh",
        "Telangana",
      ];
      const theme = hour >= 10 && hour < 12 && SOUTH_STATES.includes(data.result.region) ? 'white' : 'dark';
      document.body.className = theme === 'white' ? 'white-theme' : 'dark-theme';
    } catch (e) {
      // ignore
    }

    return data;
  } catch (error) {
    alert("Login failed. Please check your credentials.");
    console.error("❌ Login error:", error);
  }
};  

// Helper to verify OTP from client (optional wrapper)
export const verifyOtp = (payload) => async (dispatch) => {
  try {
    const { data } = await api.verifyOtp(payload);
    return data;
  } catch (err) {
    throw err;
  }
};