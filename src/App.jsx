import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CreateNote from "./pages/CreateNote";
import LandingPage from "./pages/LandingPage"; 
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ViewNotes from "./pages/ViewNotes"; 
import Profile from "./pages/Profile";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        {/* Mobile par Navbar ke niche thodi space dene ke liye 'mt-lg-0 mt-2' use kar sakte ho */}
        <main className="flex-grow-1 py-4">
          <Routes>
            {/* Public Routes with Redirect Logic */}
            <Route path="/" element={<LandingPage />} />
            
            <Route 
              path="/login" 
              element={token ? <Navigate to="/all-notes" /> : <Login />} 
            />
            
            <Route 
              path="/signup" 
              element={token ? <Navigate to="/all-notes" /> : <Signup />} 
            />

            {/* Private Routes */}
            <Route
              path="/create-note"
              element={
                <ProtectedRoute>
                  <CreateNote />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/all-notes"
              element={
                <ProtectedRoute>
                  <ViewNotes />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route: koi bhi galat URL dalo toh home par bhej dega */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;