import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API call to Backend
      const res = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log("Login Success:", res.data);

      if (res.data.access_token) {
        // 1. Token aur User Info save karo
        localStorage.setItem("token", res.data.access_token);
        
        // Backend se jo naam aa raha hai wahi pick karo
        const nameToStore = res.data.name || "User";
        localStorage.setItem("user_name", nameToStore);

        // 2. All Notes page par navigate karo
        // Note: window.location use karne ki jagah navigate use karna better hai, 
        // par agar Navbar update nahi ho raha toh window.location.href use kar sakte ho.
        navigate("/");
        window.location.reload(); // Navbar state refresh karne ke liye chota sa reload
      }
    } catch (err) {
      console.error("Login Error:", err);
      // Backend se detail message dikhao
      const errorMsg = err.response?.data?.detail || "Invalid Email or Password!";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center px-2">
        <div className="col-md-5">
          <div className="card shadow-lg border-0 p-4 rounded-4 bg-white">
            <div className="text-center mb-4">
              <h2 className="fw-bolder text-dark" style={{ letterSpacing: "-1px" }}>
                Welcome Back
              </h2>
              <p className="text-muted small">Login to manage your secure notes</p>
            </div>

            <form onSubmit={handleLogin} autoComplete="on">
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control py-2 border-0 bg-light rounded-3 shadow-none"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control py-2 border-0 bg-light rounded-3 shadow-none"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-success w-100 fw-bold py-2 rounded-pill shadow-sm mb-3 border-0 text-white"
                disabled={loading}
                style={{ backgroundColor: "#28a745" }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Verifying...
                  </>
                ) : (
                  "Login to EasyNotes"
                )}
              </button>

              <div className="text-center mt-3">
                <p className="small text-muted mb-0">
                  New here?{" "}
                  <span
                    className="text-success fw-bold"
                    role="button"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/signup")}
                  >
                    Create Account
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;