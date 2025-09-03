import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { RiVideoAddLine } from 'react-icons/ri';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { BiUserCircle } from 'react-icons/bi';
import { FaSearch } from 'react-icons/fa';
import { BsMicFill } from 'react-icons/bs';
import { FaSun, FaMoon } from 'react-icons/fa';

import logo from './logo.ico';
import Auth from '../../Pages/Auth/Auth';
import OtpModal from '../Auth/OtpModal';
import { login } from '../../action/auth';
import setcurrentuser from '../../action/currentuser';

import './Navbar.css'; // Optional for dark theme or styling

const slugify = (text) =>
  text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

const Navbar = ({ toggledrawer, seteditcreatechanelbtn, theme, toggleTheme }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentuser = useSelector(state => state.currentuserreducer);
  const videolist = useSelector(state => state?.videoreducer?.data || []);

  const [authbtn, setauthbtn] = useState(false);
  const [user, setuser] = useState(null);
  const [profile, setprofile] = useState(null);
  const [otpState, setOtpState] = useState({ show: false, email: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchListVisible, setSearchListVisible] = useState(false);

  const google_login = useGoogleLogin({
    onSuccess: tokenResponse => setuser(tokenResponse),
    onError: error => console.log('Login Failed', error)
  });

  useEffect(() => {
    if (user) {
      axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            Accept: 'application/json'
          }
        })
        .then(res => {
          setprofile(res.data);
          // Dispatch login and react to server response (OTP channel)
          dispatch(login({ email: res.data.email ,name: res.data.name })).then((resp) => {
            try {
              const serverResult = resp?.data || resp;
              if (serverResult?.result?.otpSentTo) {
                // show OTP modal
                setOtpState({ show: true, email: res.data.email });
              }
            } catch (e) {}
          }).catch(()=>{});
        })
        .catch(err => console.error('Google User Info Error', err));
    }
  }, [user, dispatch]);

  useEffect(() => {
    dispatch(setcurrentuser(JSON.parse(localStorage.getItem('Profile'))));
  }, [dispatch]);

  useEffect(() => {
    const token = currentuser?.token;
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        logout();
      }
    }
  }, [currentuser]);

  const logout = () => {
    dispatch(setcurrentuser(null));
    googleLogout();
    localStorage.clear();
  };

  const handleSearch = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${slugify(searchQuery)}`);
      setSearchListVisible(false);
    }
  };

  const filteredTitles = videolist
    ?.filter(video =>
      video?.videotitle?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    ?.map(video => video?.videotitle);

  const handleSuggestionClick = (title) => {
    setSearchQuery(title);
    navigate(`/search/${slugify(title)}`);
    setSearchListVisible(false);
  };

  return (
    <>
      <div className="navbar-container container-fluid bg-dark text-white py-2 px-3 position-relative">
        {/* Top Row: Logo + Search (desktop) + Icons */}
        <div className="row align-items-center justify-content-between">
          {/* Logo + Drawer */}
          <div className="col-6 col-md-3 d-flex align-items-center">
            <div className="burger me-2" onClick={toggledrawer} role="button" aria-label="Open menu">
              <span />
              <span />
              <span />
            </div>
            <Link to="/" className="d-flex align-items-center text-white text-decoration-none">
              <img src={logo} alt="logo" height="26" />
              <span className="ms-2 fw-bold fs-5">Your-Tube</span>
            </Link>
          </div>

          {/* Search (desktop) */}
          <div className="col-md-6 d-none d-md-block">
            <form className="d-flex position-relative" onSubmit={handleSearch}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onClick={() => setSearchListVisible(true)}
                  onBlur={() => setTimeout(() => setSearchListVisible(false), 150)}
                />
                <button className="btn btn-outline-secondary" type="submit">
                  <FaSearch />
                </button>
              </div>
              {searchQuery && searchListVisible && filteredTitles.length > 0 && (
                <div className="position-absolute bg-dark border border-secondary rounded mt-1 w-100 z-3">
                  {filteredTitles.map((title, index) => (
                    <p
                      key={index}
                      className="px-3 py-2 m-0 text-white"
                      onClick={() => handleSuggestionClick(title)}
                      style={{ cursor: 'pointer' }}
                    >
                      <FaSearch className="me-2" /> {title}
                    </p>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Icons + Profile */}
          <div className="col-6 col-md-3 d-flex justify-content-end align-items-center gap-3">
            <button onClick={toggleTheme} aria-label="toggle theme" title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'} className="btn btn-sm btn-toggle-theme d-flex align-items-center justify-content-center">
              {theme === 'dark' ? <FaSun color="#ffd166" /> : <FaMoon color="#ffd166" />}
            </button>
            <RiVideoAddLine size={20} className="text-white cursor-pointer" />
            <IoMdNotificationsOutline size={20} className="text-white cursor-pointer" />
            {currentuser ? (
              <div
                className="rounded-circle overflow-hidden bg-secondary"
                onClick={() => setauthbtn(true)}
                style={{ width: 32, height: 32, cursor: 'pointer' }}
              >
                {profile?.picture ? (
                  <img src={profile.picture} alt="profile" className="w-100 h-100 object-fit-cover" />
                ) : (
                  <p className="text-white fw-bold text-center mt-1">
                    {currentuser?.result?.name
                      ? currentuser.result.name.charAt(0).toUpperCase()
                      : currentuser?.result?.email?.charAt(0).toUpperCase() || 'U'}
                  </p>
                )}
              </div>
            ) : (
              <button className="btn btn-outline-info btn-sm d-flex align-items-center gap-1" onClick={google_login}>
                <BiUserCircle size={20} />
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="row mt-2 d-block d-md-none">
          <div className="col">
            <form className="d-flex position-relative" onSubmit={handleSearch}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onClick={() => setSearchListVisible(true)}
                  onBlur={() => setTimeout(() => setSearchListVisible(false), 150)}
                />
                <button className="btn btn-outline-secondary" type="submit">
                  <FaSearch />
                </button>
                <BsMicFill className="ms-2 text-light mt-2" />
              </div>
              {searchQuery && searchListVisible && filteredTitles.length > 0 && (
                <div className="position-absolute bg-dark border border-secondary rounded mt-1 w-100 z-3">
                  {filteredTitles.map((title, index) => (
                    <p
                      key={index}
                      className="px-3 py-2 m-0 text-white"
                      onClick={() => handleSuggestionClick(title)}
                      style={{ cursor: 'pointer' }}
                    >
                      <FaSearch className="me-2" /> {title}
                    </p>
                  ))}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {authbtn && (
        <Auth
          seteditcreatechanelbtn={seteditcreatechanelbtn}
          setauthbtn={setauthbtn}
          user={currentuser}
        />
      )}
      {/* OTP Modal */}
      {otpState?.show && (
        <OtpModal
          email={otpState.email}
          onClose={() => setOtpState({ show: false, email: '' })}
          onVerified={() => {
            // Refresh current user from localStorage (server token already saved)
            dispatch(setcurrentuser(JSON.parse(localStorage.getItem('Profile'))));
          }}
        />
      )}
    </>
  );
};

export default Navbar;
