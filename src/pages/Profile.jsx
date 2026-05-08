import { useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await API.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Profile Synchronization Error:", err);
        alert("Unable to retrieve account specifications. Please re-authenticate.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfileData();
    else navigate("/login");
  }, [token, navigate]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-success" role="status"></div>
    </div>
  );

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            {/* Profile Header Decoration */}
            <div className="bg-success py-5 text-center text-white">
              <div className="bg-white text-success rounded-circle d-inline-flex align-items-center justify-content-center fw-bold shadow" 
                   style={{ width: "80px", height: "80px", fontSize: "2rem" }}>
                {user?.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <h4 className="mt-3 fw-bold mb-0">Account Specifications</h4>
              <p className="small opacity-75 text-white">Verified Secure Profile</p>
            </div>

            <div className="card-body p-4 p-lg-5 bg-white">
              <div className="mb-4">
                <label className="small text-muted fw-bold text-uppercase">Full Name</label>
                <p className="fs-5 fw-semibold text-dark border-bottom pb-2">{user?.name || "N/A"}</p>
              </div>

              <div className="mb-4">
                <label className="small text-muted fw-bold text-uppercase">Email Address</label>
                <p className="fs-5 fw-semibold text-dark border-bottom pb-2">{user?.email || "N/A"}</p>
              </div>

              <div className="mb-4">
                <label className="small text-muted fw-bold text-uppercase">Member Since</label>
                <p className="text-secondary border-bottom pb-2">
                  {user?.joined_at ? new Date(user.joined_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric', day: 'numeric' }) : "Recently Synchronized"}
                </p>
              </div>

              <div className="d-grid gap-3 mt-5">
                <button 
                  className="btn btn-outline-dark fw-bold rounded-pill py-2"
                  onClick={() => navigate("/all-notes")}
                >
                  Return to Vault
                </button>
                <button 
                  className="btn btn-danger fw-bold rounded-pill py-2 opacity-75"
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/login";
                  }}
                >
                  Terminate Session
                </button>
              </div>
            </div>
          </div>
          
          <p className="text-center text-muted mt-4 small">
            End-to-End Encrypted Session • EasyNotes v1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;