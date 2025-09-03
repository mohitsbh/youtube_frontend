import React from 'react';
import { BiLogOut } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import './Auth.css';
import { useDispatch } from 'react-redux';
import setcurrentuser from '../../action/currentuser';

const Auth = ({ user, setauthbtn, seteditcreatechanelbtn }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(setcurrentuser(null));
    localStorage.clear();
    googleLogout();
    navigate('/'); // optional redirect
  };

  const userName = user?.result?.name || '';
  const userEmail = user?.result?.email || 'Unknown User';
  const userId = user?.result?._id;

  return (
    <div className="Auth_container" onClick={() => setauthbtn(false)}>
      <div className="Auth_container2" onClick={(e) => e.stopPropagation()}>
        <div className="User_Details">
          <div className="Chanel_logo_App">
            <p className="fstChar_logo_App">
              {(userName || userEmail).charAt(0).toUpperCase()}
            </p>
          </div>
          <div className="email_auth">{userEmail}</div>
        </div>

        <div className="btns_Auth">
          {userName ? (
            <>
              <Link
                to={`/channel/${userId}`}
                className="btn_Auth"
                onClick={() => setauthbtn(false)}
              >
                Your Channel
              </Link>

              <Link
                to="/my-downloads"
                className="btn_Auth"
                onClick={() => setauthbtn(false)}
              >
                Downloads
              </Link>

              <Link
                to="/upgrade"
                className="btn_Auth"
                onClick={() => setauthbtn(false)}
              >
                Upgrade Plan
              </Link>
            </>
          ) : (
            <button
              className="btn_Auth"
              onClick={() => {
                setauthbtn(false);
                seteditcreatechanelbtn(true);
              }}
            >
              Create Your Own Channel
            </button>
          )}

          <div className="btn_Auth" onClick={logout}>
            <BiLogOut style={{ marginRight: '5px' }} />
            Log Out
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
