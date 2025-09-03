import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// Components
import Navbar from "./Component/Navbar/Navbar";
import Drawersliderbar from "./Component/Leftsidebar/Drawersliderbar";
import Createeditchannel from "./Pages/Channel/Createeditchannel";
import Videoupload from "./Pages/Videoupload/Videoupload";
import Allroutes from "./Allroutes";

// Redux Actions
import { fetchallchannel } from "./action/channeluser";
import { getallvideo } from "./action/video";
import { getallcomment } from "./action/comment";
import { getallhistory } from "./action/history";
import { getalllikedvideo } from "./action/likedvideo";
import { getallwatchlater } from "./action/watchlater";
import { getDownloadHistory } from "./action/download";
import { fetchThemeSuggestion } from "./action/theme";
// import theme from "./theme";
// import { ThemeProvider } from "react-bootstrap";

// --- THEME LOGIC START ---
const SOUTH_STATES = [
  "Tamil Nadu",
  "Kerala",
  "Karnataka",
  "Andhra Pradesh",
  "Telangana",
];

function getThemeByTimeAndLocation(state) {
  const hour = new Date().getHours();
  if (
    hour >= 10 &&
    hour < 12 &&
    SOUTH_STATES.includes(state)
  ) {
    return "white";
  }
  return "dark";
}
// --- THEME LOGIC END ---

function App() {
  const dispatch = useDispatch();

  // UI States
  const [toggledrawersidebar, setToggledrawerSidebar] = useState({
    display: "none",
  });
  const [editCreateChannelBtn, setEditCreateChannelBtn] = useState(false);
  const [videoUploadPage, setVideoUploadPage] = useState(false);

  // THEME STATE (persisted)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  // Fetch initial app-wide data
  useEffect(() => {
    dispatch(fetchThemeSuggestion());
    dispatch(fetchallchannel());
    dispatch(getallvideo());
    dispatch(getallcomment());
    dispatch(getallhistory());
    dispatch(getalllikedvideo());
    dispatch(getallwatchlater());
    dispatch(getDownloadHistory());
  }, [dispatch]);

  // Set theme on mount (respect persisted choice, otherwise fallback to location/time)
  useEffect(() => {
    async function setThemeBasedOnTimeAndLocation() {
      try {
        const persisted = localStorage.getItem('theme');
        if (persisted) {
          setTheme(persisted);
          document.body.className = persisted === 'white' ? 'white-theme' : 'dark-theme';
          return;
        }
      } catch (e) {}

      // no persisted theme -> attempt to infer
      let state = "";
      try {
        const res = await fetch("https://ipinfo.io/json?token=7abed5542cb821");
        const data = await res.json();
        state = data.region;
      } catch (e) {
        state = "";
      }
      const selectedTheme = getThemeByTimeAndLocation(state);
      setTheme(selectedTheme);
      document.body.className = selectedTheme === "white" ? "white-theme" : "dark-theme";
    }
    setThemeBasedOnTimeAndLocation();
  }, []);

  // toggle helper used by the navbar
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'white' : 'dark';
    setTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    document.body.className = next === 'white' ? 'white-theme' : 'dark-theme';
  };

  // Toggle drawer sidebar
  const toggleDrawer = () => {
    setToggledrawerSidebar((prev) => ({
      display: prev.display === "none" ? "flex" : "none",
    }));
  };

  return (
    <Router>
      {/* Overlay Pages */}
      {videoUploadPage && (
        <Videoupload setvideouploadpage={setVideoUploadPage} />
      )}
      {editCreateChannelBtn && (
        <Createeditchannel seteditcreatechanelbtn={setEditCreateChannelBtn} />
      )}

      {/* Global Toast Notifications */}
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Navbar + Drawer */}
      <Navbar
        seteditcreatechanelbtn={setEditCreateChannelBtn}
        toggledrawer={toggleDrawer}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <Drawersliderbar
        toggledraw={toggleDrawer}
        toggledrawersidebar={toggledrawersidebar}
      />

      {/* Routes */}
      <Allroutes
        seteditcreatechanelbtn={setEditCreateChannelBtn}
        setvideouploadpage={setVideoUploadPage}
      />
    </Router>
  );
}

export default App;