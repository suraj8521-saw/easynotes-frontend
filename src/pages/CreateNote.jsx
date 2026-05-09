import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api"; // Aapka axios instance jahan baseURL set hai

const CreateNote = () => {
  const [note, setNote] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote({ ...note, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    
    const token = localStorage.getItem("token");

    // Agar token nahi hai toh login pe bhej do
    if (!token) {
      alert("Please login First!");
      navigate("/login");
      return;
    }

    try {
      // LIVE BACKEND CALL
      const response = await API.post(
        "/save-note", // Aapka backend route
        note,
        {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        }
      );

      alert("Success: Note saved safely to your account! ✅");
      setNote({ title: "", content: "" });
      
      // Note save hone ke baad dashboard par wapas bhej sakte hain
      navigate("/all-notes"); 

    } catch (error) {
      if (error.response?.status === 401) {
        alert("Session Expired , Login First.");
        localStorage.removeItem("token");
        navigate('/login');
      } else {
        console.error("Save Note Error:", error.response?.data || error.message);
        alert(error.response?.data?.detail || "Something Went Wrong , Please Try Again.");
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="card note-card shadow-lg border-0 p-4 rounded-4 bg-white">
            <h3 className="fw-bold text-success mb-4 text-center">
              Create New Note
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold text-secondary">Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control py-2 shadow-sm border-0 bg-light"
                  placeholder="Enter note title..."
                  value={note.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold text-secondary">Content</label>
                <textarea
                  name="content"
                  className="form-control py-2 shadow-sm border-0 bg-light"
                  placeholder="What's on your mind?"
                  rows="6"
                  value={note.content}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button 
                className="btn btn-success w-100 mt-2 py-2 fw-bold shadow-sm border-0"
                disabled={loading}
                style={{ backgroundColor: "#28a745" }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Encrypting & Saving...
                  </>
                ) : (
                  "Secure Save to Cloud"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNote;