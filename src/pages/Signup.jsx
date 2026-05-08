import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/auth/signup", formData);
      alert(res.data.message);
      navigate('/login'); // Signup ke baad seedha login pe bhejo
    } catch (err) {
      alert(err.response?.data?.detail || "Signup failed!");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-lg border-0 p-4 rounded-4">
            <h2 className="text-center fw-bold text-success mb-4">Join EasyNotes</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" className="form-control mb-3 py-2" placeholder="Username" 
                onChange={(e) => setFormData({...formData, username: e.target.value})} required />
              <input type="email" className="form-control mb-3 py-2" placeholder="Email Address" 
                onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              <input type="password" className="form-control mb-3 py-2" placeholder="Password" 
                onChange={(e) => setFormData({...formData, password: e.target.value})} required />
              <button className="btn btn-success w-100 fw-bold py-2 shadow-sm">Create Account</button>
            </form>
            <p className="text-center mt-3">Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;