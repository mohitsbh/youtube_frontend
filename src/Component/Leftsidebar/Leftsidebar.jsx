import React from 'react';
import { AiOutlineHome } from "react-icons/ai";
import { MdGroup, MdOutlineExplore, MdOutlineSubscriptions, MdOutlineVideoLibrary } from "react-icons/md";
import { NavLink } from 'react-router-dom';
import shorts from "./shorts.png";
import './Leftsidebar.css';

const Leftsidebar = () => {
  return (
    <div className="container_leftSidebar d-flex flex-column align-items-center py-2 vh-100 overflow-auto">
      <NavLink to="/" className="icon_sidebar_div text-decoration-none d-flex flex-column align-items-center py-2 px-2 rounded hover-bg">
        <AiOutlineHome className="icon_sidebar" size={22} />
        <small className="text_sidebar_icon">Home</small>
      </NavLink>

      <div className="icon_sidebar_div text-decoration-none d-flex flex-column align-items-center py-2 px-2 rounded hover-bg">
        <MdOutlineExplore className="icon_sidebar" size={22} />
        <small className="text_sidebar_icon">Explore</small>
      </div>

      <div className="icon_sidebar_div text-decoration-none d-flex flex-column align-items-center py-2 px-2 rounded hover-bg">
        <img src={shorts} className="icon_sidebar" width={22} alt="Shorts" />
        <small className="text_sidebar_icon">Shorts</small>
      </div>

      <div className="icon_sidebar_div text-decoration-none d-flex flex-column align-items-center py-2 px-2 rounded hover-bg" style={{ fontSize: "12px" }}>
        <MdOutlineSubscriptions className="icon_sidebar" size={22} />
        <small className="text_sidebar_icon">Subscription</small>
      </div>

      <NavLink to="/Library" className="icon_sidebar_div text-decoration-none d-flex flex-column align-items-center py-2 px-2 rounded hover-bg">
        <MdOutlineVideoLibrary className="icon_sidebar" size={22} />
        <small className="text_sidebar_icon">Library</small>
      </NavLink>

      <NavLink to="/groups" className="icon_sidebar_div text-decoration-none d-flex flex-column align-items-center py-2 px-2 rounded hover-bg">
        <MdGroup className="icon_sidebar" size={22} />
        <small className="text_sidebar_icon">Groups</small>
      </NavLink>
    </div>
  );
};

export default Leftsidebar;
