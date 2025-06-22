import React, { useEffect, useState } from "react";
import { Link, useLocation,useNavigate } from "react-router-dom";
import "./Navbar.scss";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthenticated, loadUser, logout } from "../../store/auth";


function Navbar() {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.auth);


  const { pathname } = useLocation();

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    dispatch(checkAuthenticated());
    if (isAuthenticated) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log(isAuthenticated)
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    dispatch(logout());
  };
  const userName = currentUser ? currentUser.first_name : "Guest";
  const isTailor = currentUser ? currentUser.is_tailor : false;
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleClick = () => {
    if (currentUser?.id) {
      navigate("/messages");
    } else {
      setShowPopup(true);
    }
  };
  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link className="link" to="/">
            <span className="text">StyleSphare</span>
          </Link>
          <span className="dot">.</span>
        </div>
        <div className="search">
          <div className="searchInput">
            <img src="./img/search.png" alt="" />
            <input type="text" placeholder=' Tailor' />
          </div>
          <button className="searchbutton">Search</button>
        </div>
        <div className="links">
          {currentUser ? (
            <div className="user" onClick={() => setOpen(!open)}>
              <img
                // src='../../../public/img/husnain.PNG'
                src={currentUser.image}
                alt=""
              />
              <span>{userName}</span>
              {open && <div className="options">
                {isTailor && (
                  <>
                    <Link className="link" to="/mygigs">
                      Designs
                    </Link>
                    <Link className="link" to="/add">
                      Add New Design
                    </Link>
                  </>
                )}


                {/* <Link className="link" to="/messages"> */}
                <div onClick={handleClick}>
                Messages
                {showPopup &&
            ReactDOM.createPortal(
              <div className="popup">
                <div className="popup-content">
                  <h3>Please Login</h3>
                  <p>You need to be logged in to start a chat.</p>
                  <button
                    onClick={closePopup}
                    style={{
                      backgroundColor: '#932dbb',
                      marginTop: '10px',
                      padding: '10px',
                      color: 'white',
                      fontWeight: 500,
                      fontSize: '20px',
                      cursor: 'pointer',
                      justifyContent: 'center',
                      borderRadius: '8px'
                    }}
                  >
                    Close
                  </button>


                </div>
              </div>,
              document.body
            )}

          <style>
            {`
              .popup {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999; /* Ensure it's above all other elements */
              }
              .popup-content {
                background: white;
                padding: 20px;
                border-radius: 5px;
                text-align: center;
                z-index: 10000;
              }
            `}
          </style>
                </div>
{/*
                </Link> */}

                <Link className="link" to="/">

                  <button onClick={handleLogout}>
                    <p
                      style={{ color: isHovered ? "white" : "gray" }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      Logout
                    </p>
                  </button>
                </Link>
              </div>}
            </div>
          ) : (
            <>
              <Link className="link" to="/login">
                <button>Sign in</button>
              </Link>
              <Link className="link" to="/register">
                <button>Join</button>
              </Link>
            </>
          )}
        </div>
      </div>
      {(active || pathname !== "/") && (
        <>

        </>
      )}
    </div>
  );
}

export default Navbar;
