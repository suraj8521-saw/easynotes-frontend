import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Ise add karna zaroori hai

const CreateNote = () => {
  const [note, setNote] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate(); // Hook initialize kiya

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote({ ...note, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Loading shuru
    
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/save-note",
        note,
        {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        }
      );
      alert("Success: Note saved safely to your account!");
      setNote({ title: "", content: "" });
    } catch (error) {
      if(error.response?.status === 401) {
         alert("Bhai, session khatam ho gaya. Fir se login karo.");
         localStorage.removeItem("token"); // Purana token hata do
         navigate('/login');
      } else {
         console.error(error);
         alert("Backend error! Ek baar check karo server chal raha hai ya nahi.");
      }
    } finally {
      setLoading(false); // Loading band (chahe success ho ya error)
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="card note-card shadow-lg border-0 p-4 rounded-4">
            <h3 className="fw-bold text-success mb-4 text-center">
              Create New Note
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control py-2 shadow-sm"
                  placeholder="Enter note title..."
                  value={note.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Content</label>
                <textarea
                  name="content"
                  className="form-control py-2 shadow-sm"
                  placeholder="What's on your mind?"
                  rows="6"
                  value={note.content}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button 
                className="btn btn-success w-100 mt-2 py-2 fw-bold shadow"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : null}
                {loading ? "Encrypting & Saving..." : "Secure Save to DB"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNote;