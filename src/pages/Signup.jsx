import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from "../api"; // Aapka custom axios instance

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // LIVE BACKEND CALL (Render URL automatically picked from API instance)
      const res = await API.post("/auth/signup", formData);
      
      // Professional Success Alert
      alert("Account registration successful. Welcome to EasyNotes! ✅");
      navigate('/login'); 
      
    } catch (err) {
      console.error("Signup Error:", err.response?.data);
      // Professional Error Alert
      const errorMessage = err.response?.data?.detail || "Registration protocol failed. Please verify your details.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-lg border-0 p-4 p-lg-5 rounded-4 bg-white">
            <h2 className="text-center fw-bolder text-success mb-2" style={{ letterSpacing: "-1px" }}>
              Join EasyNotes<span className="text-dark">.</span>
            </h2>
            <p className="text-center text-muted small mb-4">Create your secure intellectual workspace</p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="small fw-bold text-secondary mb-1">Username</label>
                <input 
                  type="text" 
                  className="form-control py-2 shadow-none border-0 bg-light" 
                  placeholder="Choose a unique username" 
                  onChange={(e) => setFormData({...formData, username: e.target.value})} 
                  required 
                />
              </div>
              
              <div className="mb-3">
                <label className="small fw-bold text-secondary mb-1">Email Address</label>
                <input 
                  type="email" 
                  className="form-control py-2 shadow-none border-0 bg-light" 
                  placeholder="e.g. name@example.com" 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  required 
                />
              </div>
              
              <div className="mb-4">
                <label className="small fw-bold text-secondary mb-1">Password</label>
                <input 
                  type="password" 
                  className="form-control py-2 shadow-none border-0 bg-light" 
                  placeholder="Minimum 8 characters" 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  required 
                />
              </div>

              <button 
                className="btn btn-success w-100 fw-bold py-2 shadow-sm border-0"
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span>Initiating Registration...</>
                ) : (
                  "Create Secure Account"
                )}
              </button>
            </form>
            
            <div className="mt-4 text-center border-top pt-3">
              <p className="text-muted small">
                Already a member? <Link to="/login" className="text-success fw-bold text-decoration-none">Access Account</Link>
              </p>
            </div>
          </div>
          <p className="text-center text-muted mt-4 small">Protected by SHA-256 Encryption</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;