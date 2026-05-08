import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api"; // Custom axios instance use karna better hai

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Initializing User State with fallback
  const [userName, setUserName] = useState(() => {
    const saved = localStorage.getItem("user_name");
    return (saved && saved !== "undefined" && saved !== "User") ? saved : "Suraj";
  });

  useEffect(() => {
    const synchronizeUserProfile = async () => {
      if (token) {
        try {
          // Live Render API call
          const res = await API.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
          });

          const finalName = res.data.name || "Suraj";
          setUserName(finalName);
          localStorage.setItem("user_name", finalName);
        } catch (err) {
          if (err.response?.status === 401) {
            console.warn("Session authentication failed. Initiating logout.");
            handleLogout();
          }
        }
      }
    };
    synchronizeUserProfile();
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    // Use professional notification instead of basic alert
    console.log("User session terminated successfully.");
    window.location.href = "/login";
  };

  const isActive = (path) => location.pathname === path;
  
  // Extracting first name for a professional greeting
  const displayName = userName ? userName.split(" ")[0] : "User";

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm" 
         style={{ position: 'sticky', top: 0, zIndex: 1100, width: '100%' }}>
      <div className="container-fluid px-lg-5">
        <Link className="navbar-brand fw-bold text-success fs-3" style={{ letterSpacing: "-1px" }} to="/">
          EasyNotes<span className="text-dark">.</span>
        </Link>

        <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-2 gap-lg-3 py-3 py-lg-0">
            {token ? (
              <>
                <li className="nav-item">
                  <Link 
                    className={`nav-link fw-bold px-3 rounded-pill transition-all ${isActive('/create-note') ? 'text-success bg-light' : 'text-secondary'}`} 
                    to="/create-note"
                  >
                    + New Entry
                  </Link>
                </li>

                <li className="nav-item">
                  <Link 
                    className={`nav-link fw-bold px-3 rounded-pill transition-all ${isActive('/all-notes') ? 'text-success bg-light' : 'text-secondary'}`} 
                    to="/all-notes"
                  >
                    View Archives
                  </Link>
                </li>
                
                {/* Profile Link with improved UX */}
                <li className="nav-item ms-lg-2">
                  <div 
                    onClick={() => navigate("/profile")}
                    className="d-flex align-items-center bg-white border rounded-pill p-1 pe-3 shadow-sm hover-effect"
                    style={{ cursor: 'pointer', transition: '0.3s' }}
                  >
                    <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" 
                         style={{ width: "32px", height: "32px", fontSize: '0.8rem' }}>
                      {displayName[0].toUpperCase()}
                    </div>
                    <span className="ms-2 small fw-bold text-dark">Account: {displayName}</span>
                  </div>
                </li>
                
                <li className="nav-item">
                  <button 
                    className="btn btn-link text-danger text-decoration-none fw-bold small" 
                    onClick={() => {
                      if(window.confirm("Are you sure you want to terminate your session?")) handleLogout();
                    }}
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-success rounded-pill px-4 fw-bold shadow-sm" to="/login">Access Account</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;