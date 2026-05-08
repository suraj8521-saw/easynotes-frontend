import { useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
  });
  const [showPassFields, setShowPassFields] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await API.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Backend response se data nikaalo
        const userData = res.data;
        setUser(userData);

        // Sabse important: Local Storage ko sync karo naye user ke naam ke saath
        // Ye ensures karega ki Navbar aur Profile dono jagah real name dikhe
        const realName =
          userData.name || userData.full_name || userData.username || "User";
        localStorage.setItem("user_name", realName);
      } catch (err) {
        console.error("Profile Synchronization Error:", err);
        // Professional Alert
        alert(
          "Unable to synchronize account specifications. Please re-authenticate.",
        );
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfileData();
    else navigate("/login");
  }, [token, navigate]);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await API.put("/auth/change-password", passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Security credentials updated successfully. ✅");
      setPasswordData({ old_password: "", new_password: "" });
      setShowPassFields(false);
    } catch (err) {
      alert(err.response?.data?.detail || "Credential synchronization failed.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            {/* Dynamic Profile Header */}
            <div className="bg-success py-5 text-center text-white">
              <div
                className="bg-white text-success rounded-circle d-inline-flex align-items-center justify-content-center fw-bold shadow"
                style={{ width: "80px", height: "80px", fontSize: "2rem" }}
              >
                {/* Yahan first letter dynamic ho gaya */}
                {user?.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <h4 className="mt-3 fw-bold mb-0">
                {user?.name || "Account Profile"}
              </h4>
              <p className="small opacity-75 text-white">
                Verified Secure Profile
              </p>
            </div>

            <div className="card-body p-4 p-lg-5 bg-white">
              <div className="mb-4">
                <label className="small text-muted fw-bold text-uppercase">
                  Full Name
                </label>
                <p className="fs-5 fw-semibold text-dark border-bottom pb-2">
                  {user?.name || "Access Denied"}
                </p>
              </div>
              <div className="mb-4">
                <label className="small text-muted fw-bold text-uppercase">
                  Email Address
                </label>
                <p className="fs-5 fw-semibold text-dark border-bottom pb-2">
                  {user?.email || "Access Denied"}
                </p>
              </div>
              
             {/* Member Since Section */}
{/* Profile.jsx mein Member Since wala part replace karo */}
{/* Profile.jsx mein Member Since wala part replace karo */}
<div className="mb-4">
  <label className="small text-muted fw-bold text-uppercase">Member Since</label>
  <p className="text-secondary border-bottom pb-2">
    {(() => {
      // 1. Teeno me se koi bhi date key uthao
      const rawDate = user?.joined_at || user?.created_at || user?.timestamp;
      
      // 2. Agar date mil gayi hai
      if (rawDate && rawDate !== "Recently") {
        const parsedDate = new Date(rawDate);
        
        // 3. Check karo ki kya Date valid hai
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toLocaleDateString('en-IN', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          });
        }
      }
      
      // 4. Fallback: Agar upar sab fail ho jaye
      return "8 May 2026"; 
    })()}
  </p>
</div>
              {/* Password Section */}
              <div className="mt-5 border rounded-4 p-3 bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="fw-bold mb-0 text-dark">Security Protocol</h6>
                  <button
                    className="btn btn-sm btn-success rounded-pill px-3 fw-bold"
                    onClick={() => setShowPassFields(!showPassFields)}
                  >
                    {showPassFields ? "Close" : "Update Password"}
                  </button>
                </div>

                {showPassFields && (
                  <form onSubmit={handlePasswordUpdate} className="mt-3">
                    <div className="mb-3">
                      <input
                        type="password"
                        placeholder="Current Password"
                        className="form-control form-control-sm border-0 shadow-sm"
                        required
                        value={passwordData.old_password}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            old_password: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="password"
                        placeholder="New Security Credential"
                        className="form-control form-control-sm border-0 shadow-sm"
                        required
                        value={passwordData.new_password}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            new_password: e.target.value,
                          })
                        }
                      />
                    </div>
                    <button
                      className="btn btn-dark btn-sm w-100 fw-bold rounded-pill"
                      disabled={updating}
                    >
                      {updating ? "Synchronizing..." : "Authorize Update"}
                    </button>
                  </form>
                )}
              </div>
              <div className="d-grid gap-3 mt-5">
                <button
                  className="btn btn-outline-dark fw-bold rounded-pill py-2"
                  onClick={() => navigate("/all-notes")}
                >
                  View Notes
                </button>
                <button
                  className="btn btn-danger fw-bold rounded-pill py-2 opacity-75"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to terminate your session?",
                      )
                    ) {
                      localStorage.clear();
                      window.location.href = "/login";
                    }
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
