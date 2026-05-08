import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [showPassForm, setShowPassForm] = useState(false);
  const [passData, setPassData] = useState({ old_password: "", new_password: "" });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // --- User Details Fetch Karo ---
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    axios.get("http://127.0.0.1:8000/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUser(res.data))
    .catch(() => navigate("/login"));
  }, [token, navigate]);

  // --- Password Change Logic ---
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put("http://127.0.0.1:8000/auth/change-password", passData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
      setPassData({ old_password: "", new_password: "" }); // Form clear karo
      setShowPassForm(false); // Form band karo
    } catch (err) {
      alert(err.response?.data?.detail || "Update fail ho gaya, bhai!");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center mt-5"><h4>Bhai, details nikal raha hoon...</h4></div>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            {/* Header Section */}
            <div className="bg-success py-5 text-center">
              <div className="bg-white text-success rounded-circle d-inline-flex align-items-center justify-content-center fw-bold shadow" style={{ width: '100px', height: '100px', fontSize: '3rem' }}>
                {user.name[0].toUpperCase()}
              </div>
            </div>

            {/* Profile Info */}
            <div className="card-body p-4 text-center">
              <h3 className="fw-bold mb-1">{user.name}</h3>
              <p className="text-muted mb-4">{user.email}</p>
              
              <div className="text-start bg-light p-3 rounded-3 mb-4 border">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Status</span>
                  <span className="fw-bold text-success small">Verified ✅</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted small">Joined</span>
                  <span className="fw-bold small">{new Date(user.joined_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Toggle Change Password Section */}
              <div className="mb-3">
                <button 
                  className={`btn btn-sm w-100 fw-bold rounded-pill ${showPassForm ? 'btn-light text-danger' : 'btn-outline-danger'}`}
                  onClick={() => setShowPassForm(!showPassForm)}
                >
                  {showPassForm ? "✖ Cancel Update" : "🔐 Change Password"}
                </button>
              </div>

              {showPassForm && (
                <form onSubmit={handlePasswordUpdate} className="text-start bg-white p-3 rounded-3 border shadow-sm mb-4">
                  <div className="mb-2">
                    <label className="small fw-bold text-muted">Old Password</label>
                    <input 
                      type="password" 
                      className="form-control form-control-sm border-0 bg-light" 
                      required 
                      value={passData.old_password}
                      onChange={(e) => setPassData({...passData, old_password: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="small fw-bold text-muted">New Password</label>
                    <input 
                      type="password" 
                      className="form-control form-control-sm border-0 bg-light" 
                      required 
                      value={passData.new_password}
                      onChange={(e) => setPassData({...passData, new_password: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="btn btn-success btn-sm w-100 fw-bold" disabled={loading}>
                    {loading ? "Updating..." : "Save New Password"}
                  </button>
                </form>
              )}

              <button className="btn btn-outline-success w-100 fw-bold rounded-pill" onClick={() => navigate("/all-notes")}>
                View My Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;