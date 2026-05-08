import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const [userName, setUserName] = useState(() => {
    const saved = localStorage.getItem("user_name");
    return (saved && saved !== "undefined" && saved !== "User") ? saved : "Suraj";
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await axios.get("https://unsterile-molar-risotto.ngrok-free.dev/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
          });

          let finalName = res.data.name || res.data.full_name || "Suraj";
          setUserName(finalName);
          localStorage.setItem("user_name", finalName);
        } catch (err) {
          if (err.response?.status === 401) handleLogout();
        }
      }
    };
    fetchUser();
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const isActive = (path) => location.pathname === path;
  const displayName = userName.split(" ")[0];

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom" 
         style={{ position: 'sticky', top: 0, zIndex: 1100, width: '100%' }}>
      <div className="container-fluid px-lg-5">
        <Link className="navbar-brand fw-bold text-success fs-3" to="/">EasyNotes.</Link>

        <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-2 gap-lg-3 py-3 py-lg-0">
            {token ? (
              <>
                {/* 1. New Note Link (Added Here) */}
                <li className="nav-item w-100 text-center text-lg-start">
                  <Link 
                    className={`nav-link fw-bold px-3 rounded-pill ${isActive('/create-note') ? 'text-success bg-success-subtle' : 'text-secondary'}`} 
                    to="/create-note"
                  >
                    + New Note
                  </Link>
                </li>

                {/* 2. My Vault Link */}
                <li className="nav-item w-100 text-center text-lg-start">
                  <Link 
                    className={`nav-link fw-bold px-3 rounded-pill ${isActive('/all-notes') ? 'text-success bg-success-subtle' : 'text-secondary'}`} 
                    to="/all-notes"
                  >
                    View Notes
                  </Link>
                </li>
                
                {/* 3. Profile Section */}
                <li className="nav-item">
                  <div 
                    onClick={() => navigate("/profile")}
                    className="d-flex align-items-center bg-light border rounded-pill p-1 pe-3 shadow-sm"
                    style={{ cursor: 'pointer', minWidth: 'max-content' }}
                  >
                    <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: "35px", height: "35px" }}>
                      {displayName[0].toUpperCase()}
                    </div>
                    <span className="ms-2 small fw-bold text-dark">Hello, {displayName}</span>
                  </div>
                </li>
                
                {/* 4. Sign Out */}
                <li className="nav-item">
                  <button className="btn btn-link text-danger text-decoration-none fw-bold small" onClick={handleLogout}>
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-success rounded-pill px-4 fw-bold" to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;