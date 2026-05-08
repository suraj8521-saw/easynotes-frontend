import { useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordData, setPasswordData] = useState({ old_password: "", new_password: "" });
  const [updating, setUpdating] = useState(false);

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
      setShowPasswordFields(false);
      setPasswordData({ old_password: "", new_password: "" });
    } catch (err) {
      alert(err.response?.data?.detail || "Credential synchronization failed.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-success"></div></div>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="bg-dark py-4 text-center text-white">
              <h4 className="fw-bold mb-0">Security & Account</h4>
            </div>

            <div className="card-body p-4 p-lg-5 bg-white">
              {/* User Info Section */}
              <div className="mb-4 text-center">
                <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold mb-3" 
                     style={{ width: "70px", height: "70px", fontSize: "1.5rem" }}>
                  {user?.name?.[0].toUpperCase()}
                </div>
                <h5 className="fw-bold">{user?.name}</h5>
                <p className="text-muted small">{user?.email}</p>
              </div>

              <hr />

              {/* Password Toggle Section */}
              <div className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold m-0 text-secondary">Security Protocol</h6>
                  <button 
                    className="btn btn-sm btn-outline-success rounded-pill"
                    onClick={() => setShowPasswordFields(!showPasswordFields)}
                  >
                    {showPasswordFields ? "Cancel" : "Update Password"}
                  </button>
                </div>

                {showPasswordFields && (
                  <form onSubmit={handlePasswordUpdate} className="bg-light p-3 rounded-3 shadow-sm">
                    <div className="mb-3">
                      <label className="small fw-bold">Current Password</label>
                      <input 
                        type="password" 
                        className="form-control form-control-sm" 
                        required
                        value={passwordData.old_password}
                        onChange={(e) => setPasswordData({...passwordData, old_password: e.target.value})}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="small fw-bold">New Security Credential</label>
                      <input 
                        type="password" 
                        className="form-control form-control-sm" 
                        required
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                      />
                    </div>
                    <button className="btn btn-success btn-sm w-100 fw-bold" disabled={updating}>
                      {updating ? "Synchronizing..." : "Authorize Update"}
                    </button>
                  </form>
                )}
              </div>

              <div className="d-grid gap-2 mt-5">
                <button className="btn btn-dark fw-bold rounded-pill" onClick={() => navigate("/all-notes")}>
                  Return to Vault
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;