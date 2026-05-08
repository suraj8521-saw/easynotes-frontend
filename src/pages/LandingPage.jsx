import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleStartWriting = () => {
    if (token) {
      navigate("/create-note");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="container-fluid p-0">
      {/* Hero Section */}
      <div className="container py-5 mt-lg-5">
        <div className="row align-items-center">
          <div className="col-lg-7 text-start">
            <h1 className="display-1 fw-bold mb-0" style={{ letterSpacing: "-3px", lineHeight: "1" }}>
              Your Ideas,
            </h1>
            <h1 className="display-1 fw-bold text-success mb-4" style={{ letterSpacing: "-3px" }}>
              Everywhere.
            </h1>
            
            <p className="lead text-secondary mb-5 fs-4 w-75" style={{ lineHeight: "1.6" }}>
              Welcome to <strong>EasyNotes</strong>. Create, store, and access your personal notes 
              securely from any device, anywhere in the world. Simple, fast, and always in sync.
            </p>
            
            <div className="d-flex gap-3">
              {/* Intelligent Start Button */}
              <button 
                onClick={handleStartWriting} 
                className="btn btn-success btn-lg px-5 py-3 fw-bold rounded-3 shadow-sm border-0"
                style={{ backgroundColor: "#428d5e" }}
              >
                {token ? "Start Writing Now" : "Start Writing Now"}
              </button>

              {/* Conditional Secondary Button */}
              {!token ? (
                <button 
                  onClick={() => navigate("/login")} 
                  className="btn btn-outline-dark btn-lg px-5 py-3 fw-bold rounded-3 shadow-sm"
                  style={{ borderWidth: "2px" }}
                >
                  Sign In
                </button>
              ) : (
                <button 
                  onClick={() => navigate("/all-notes")} 
                  className="btn btn-outline-dark btn-lg px-5 py-3 fw-bold rounded-3 shadow-sm"
                  style={{ borderWidth: "2px" }}
                >
                  View My Vault
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section (Jo image ke niche cards the) */}
      <div className="container mt-5 pt-5 pb-5">
        <div className="row g-4 justify-content-center">
          <div className="col-md-4">
            <div className="card border-0 bg-light p-4 rounded-4 shadow-sm text-center h-100">
              <div className="fs-1 mb-3">🌎</div>
              <h5 className="fw-bold">Global Access</h5>
              <p className="text-muted small">Access your notes from any browser or device instantly.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 bg-light p-4 rounded-4 shadow-sm text-center h-100">
              <div className="fs-1 mb-3">🛡️</div>
              <h5 className="fw-bold">Secure Storage</h5>
              <p className="text-muted small">Your ideas are protected with industry-standard encryption.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 bg-light p-4 rounded-4 shadow-sm text-center h-100">
              <div className="fs-1 mb-3">⚡</div>
              <h5 className="fw-bold">Fast & Simple</h5>
              <p className="text-muted small">Built with MERN stack for blazing fast performance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;