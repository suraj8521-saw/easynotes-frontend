import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api"; // Axios instance use kar rahe hain

const ViewNotes = () => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editData, setEditData] = useState({ title: "", content: "" });
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // --- Helper: Professional Time Formatting ---
  const formatTime = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', { 
      day: '2-digit', month: 'short', year: 'numeric', 
      hour: '2-digit', minute: '2-digit', hour12: true 
    });
  };

  // --- Core: Fetch Notes ---
  const fetchNotes = useCallback(async () => {
    try {
      const response = await API.get("/get-notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(response.data);
    } catch (error) {
      console.error("Fetch Error:", error);
      // Professional Alert
      alert("Unable to synchronize with the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { 
    if (!token) navigate("/login");
    fetchNotes(); 
  }, [fetchNotes, token, navigate]);

  // --- Action: Copy & Share ---
  const handleCopy = (note) => {
    const shareText = `*${note.title.toUpperCase()}*\n${note.content}\n\n— Managed via EasyNotes`;
    navigator.clipboard.writeText(shareText);
    alert("Note copied to clipboard successfully. ✅");
  };

  const handleShare = (note) => {
    const shareText = `*${note.title.toUpperCase()}*\n${note.content}`;
    if (navigator.share) {
      navigator.share({ title: note.title, text: shareText });
    } else {
      handleCopy(note);
    }
  };

  // --- Action: Toggle Pin ---
  const handleTogglePin = async (id) => {
    try {
      // Optimistic UI update
      setNotes(prev => prev.map(n => n.id === id ? { ...n, is_pinned: !n.is_pinned } : n));
      await API.put(`/toggle-pin/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      fetchNotes(); // Revert on failure
      alert("Priority update failed. Please try again.");
    }
  };

  // --- Action: Delete ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently remove this note?")) return;
    try {
      await API.delete(`/delete-note/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((n) => n.id !== id));
      alert("Note successfully decommissioned. 🗑️");
    } catch (error) {
      alert("Operation failed. The note could not be deleted.");
    }
  };

  // --- Action: Update ---
  const handleUpdate = async () => {
    try {
      await API.put(`/update-note/${selectedNote.id}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Note content synchronized successfully. ✅");
      fetchNotes();
      setSelectedNote(null);
    } catch (error) {
      alert("Update synchronization failed.");
    }
  };

  // --- Logic: Search & Sort ---
  const filteredAndSortedNotes = notes
    .filter((n) => 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      n.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (b.is_pinned !== a.is_pinned) return b.is_pinned ? -1 : 1;
      return new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at);
    });

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
      <div className="spinner-grow text-success" role="status">
        <span className="visually-hidden">Loading Secure Vault...</span>
      </div>
    </div>
  );

  return (
    <div style={{ 
      backgroundColor: "#f8fafc", 
      minHeight: "100vh",
      paddingBottom: "80px"
    }}>
      <div className="container px-lg-5 pt-5">
        
        {/* Header Section */}
        <div className="row align-items-center mb-5">
          <div className="col-lg-4">
            <h1 className="fw-bolder m-0 text-dark" style={{ letterSpacing: "-1.5px" }}>
              Secure Vault<span className="text-success">.</span>
            </h1>
            <p className="text-muted small">Your intellectual workspace, organized.</p>
          </div>
          <div className="col-lg-5 my-3 my-lg-0">
            <div className="input-group shadow-sm rounded-4 border-0 bg-white px-3 py-1">
              <span className="input-group-text bg-white border-0 text-muted">🔍</span>
              <input 
                type="text" 
                className="form-control border-0 shadow-none" 
                placeholder="Search your records..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
          </div>
          <div className="col-lg-3 text-lg-end">
            <button 
              className="btn btn-success fw-bold rounded-pill px-4 py-2 shadow-sm w-100" 
              onClick={() => navigate("/create-note")}
            >
              + Create New Entry
            </button>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="row g-4">
          {filteredAndSortedNotes.length > 0 ? (
            filteredAndSortedNotes.map((note) => (
              <div className="col-xl-3 col-lg-4 col-md-6" key={note.id}>
                <div className={`card h-100 border-0 shadow-sm rounded-4 ${note.is_pinned ? 'border-start border-success border-4' : ''}`} style={{ transition: 'transform 0.2s' }}>
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="fw-bold text-dark text-truncate w-75">{note.title}</h6>
                      <button 
                        className="btn btn-link p-0 text-decoration-none" 
                        onClick={() => handleTogglePin(note.id)}
                        style={{ fontSize: '1.2rem' }}
                      >
                        {note.is_pinned ? "📌" : "📍"}
                      </button>
                    </div>

                    <p className="card-text text-secondary mb-4" style={{ fontSize: '0.85rem', flexGrow: 1 }}>
                      {note.content.length > 100 ? `${note.content.substring(0, 100)}...` : note.content}
                    </p>

                    <div className="mt-auto pt-3 border-top border-light">
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted italic" style={{ fontSize: '0.65rem' }}>
                          Last Sync: {formatTime(note.updated_at || note.created_at)}
                        </small>
                        <div className="d-flex gap-2">
                          <button className="btn btn-light btn-sm rounded-circle" onClick={() => handleCopy(note)}>📋</button>
                          <button className="btn btn-light btn-sm rounded-circle text-danger" onClick={() => handleDelete(note.id)}>🗑️</button>
                          <button 
                            className="btn btn-dark btn-sm rounded-pill px-3" 
                            onClick={() => { setSelectedNote(note); setEditData({title: note.title, content: note.content}); }}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center mt-5">
              <h5 className="text-muted">No records found matching your query.</h5>
            </div>
          )}
        </div>
      </div>

      {/* Editor Modal */}
      {selectedNote && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow-2xl">
              <div className="modal-header border-0 px-4 pt-4">
                <h5 className="modal-title fw-bold text-dark">Review & Edit Note</h5>
                <button type="button" className="btn-close shadow-none" onClick={() => setSelectedNote(null)}></button>
              </div>
              <div className="modal-body p-4 pt-2">
                <label className="small fw-bold text-muted mb-2">Document Title</label>
                <input 
                  className="form-control mb-4 border-0 bg-light py-2 fw-bold rounded-3 shadow-none" 
                  value={editData.title} 
                  onChange={(e) => setEditData({...editData, title: e.target.value})} 
                />
                <label className="small fw-bold text-muted mb-2">Document Content</label>
                <textarea 
                  className="form-control border-0 bg-light rounded-3 shadow-none" 
                  rows="10" 
                  value={editData.content} 
                  onChange={(e) => setEditData({...editData, content: e.target.value})}
                ></textarea>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button className="btn btn-success w-100 fw-bold py-3 rounded-pill shadow-lg" onClick={handleUpdate}>
                  Synchronize Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewNotes;