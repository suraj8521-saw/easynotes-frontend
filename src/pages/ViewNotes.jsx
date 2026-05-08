import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewNotes = () => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editData, setEditData] = useState({ title: "", content: "" });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const formatTime = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/get-notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(response.data);
    } catch (error) { console.error("Fetch Error", error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchNotes(); }, []);

  const handleCopy = (note) => {
    const shareText = `*${note.title.toUpperCase()}*\n-------------------------\n${note.content}\n\n_Sent via EasyNotes_`;
    navigator.clipboard.writeText(shareText);
    alert("Branded Note copied! ✅");
  };

  const handleShare = (note) => {
    const shareText = `*${note.title.toUpperCase()}*\n-------------------------\n${note.content}`;
    if (navigator.share) {
      navigator.share({ title: note.title, text: shareText });
    } else {
      handleCopy(note);
    }
  };

  const handleTogglePin = async (id) => {
    try {
      setNotes(prev => prev.map(n => n.id === id ? { ...n, is_pinned: !n.is_pinned } : n));
      await axios.put(`http://127.0.0.1:8000/toggle-pin/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) { fetchNotes(); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bhai, delete karna hai?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/delete-note/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((n) => n.id !== id));
    } catch (error) { alert("Delete fail!"); }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/update-note/${selectedNote.id}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Note updated! ✅");
      fetchNotes();
      setSelectedNote(null);
    } catch (error) { alert("Update fail!"); }
  };

  const filteredAndSortedNotes = [...notes]
    .filter((n) => n.title.toLowerCase().includes(searchTerm.toLowerCase()) || n.content.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (b.is_pinned !== a.is_pinned) return b.is_pinned ? 1 : -1;
      return new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at);
    });

  if (loading) return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-success"></div></div>;

  return (
    <div style={{ 
      backgroundColor: "#f1f5f9", 
      backgroundImage: "radial-gradient(#cbd5e1 0.8px, transparent 0.8px)", 
      backgroundSize: "24px 24px", 
      minHeight: "100vh",
      paddingBottom: "60px"
    }}>
      <div className="container-fluid px-lg-5 pt-5">
        
        {/* Modern Header Area */}
        <div className="row align-items-center mb-5 mx-lg-2">
          <div className="col-lg-4">
            <h1 className="fw-bolder m-0 text-dark" style={{ letterSpacing: "-1.5px" }}>My Vault<span className="text-success">.</span></h1>
            <p className="text-muted small">Manage your ideas in style.</p>
          </div>
          <div className="col-lg-5">
            <div className="input-group shadow-sm rounded-4 border-0 bg-white px-3 py-1">
              <span className="input-group-text bg-white border-0 text-muted">🔍</span>
              <input type="text" className="form-control border-0 shadow-none" placeholder="Search anything..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
          <div className="col-lg-3 text-end">
            <button className="btn btn-success fw-bold rounded-4 px-4 py-2 shadow-sm w-100 w-lg-auto" onClick={() => navigate("/create-note")}>+ New Note</button>
          </div>
        </div>

        {/* Desktop Grid (4 items in a row on XL screens) */}
        <div className="row g-4 mx-lg-2">
          {filteredAndSortedNotes.map((note) => (
            <div className="col-xl-3 col-lg-4 col-md-6" key={note.id}>
              <div className={`card h-100 border-0 shadow-sm rounded-4 transition-card ${note.is_pinned ? 'border-top border-success border-4' : ''}`} style={{ background: "rgba(255, 255, 255, 0.95)" }}>
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title fw-bold text-dark text-truncate mb-0">{note.title}</h5>
                    {note.is_pinned && <span title="Pinned">📌</span>}
                  </div>

                  <p className="card-text text-secondary mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.6', flexGrow: 1 }}>
                    {note.content.substring(0, 120)}{note.content.length > 120 ? '...' : ''}
                  </p>

                  <div className="pt-3 border-top border-light">
                    <small className="text-muted d-block mb-3" style={{ fontSize: '0.7rem' }}>
                      🕒 {note.updated_at ? `Updated: ${formatTime(note.updated_at)}` : `Created: ${formatTime(note.created_at)}`}
                    </small>

                    {/* Action Bar (ALL BUTTONS HERE) */}
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex gap-1">
                        <button className="btn btn-light btn-sm rounded-circle" onClick={() => handleTogglePin(note.id)} title="Pin">📍</button>
                        <button className="btn btn-light btn-sm rounded-circle" onClick={() => handleCopy(note)} title="Copy">📋</button>
                        <button className="btn btn-light btn-sm rounded-circle" onClick={() => handleShare(note)} title="Share">🔗</button>
                        <button className="btn btn-light btn-sm rounded-circle text-danger" onClick={() => handleDelete(note.id)} title="Delete">🗑️</button>
                      </div>
                      <button className="btn btn-dark btn-sm rounded-pill px-3 fw-bold" onClick={() => { setSelectedNote(note); setEditData({title: note.title, content: note.content}); }}>View</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Section */}
      {selectedNote && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header border-0 px-4 pt-4">
                <h5 className="modal-title fw-bold">Update Note</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedNote(null)}></button>
              </div>
              <div className="modal-body p-4 pt-0">
                <input className="form-control mb-3 border-0 bg-light py-2 fw-bold rounded-3" value={editData.title} onChange={(e) => setEditData({...editData, title: e.target.value})} />
                <textarea className="form-control border-0 bg-light rounded-3" rows="8" value={editData.content} onChange={(e) => setEditData({...editData, content: e.target.value})}></textarea>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button className="btn btn-success w-100 fw-bold py-2 rounded-pill shadow-sm" onClick={handleUpdate}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewNotes;