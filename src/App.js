import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Admin from "./Admin";
import StudentDashboard from "./StudentDashboard";
import Home from "./Home";
import Contact from "./Contact";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>

        {/* 🏠 Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />

        {/* 🔐 Protected admin route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* 🎓 Student dashboard */}
        <Route path="/dashboard" element={<StudentDashboard />} />

        {/* 🚫 fallback route */}
        <Route path="*" element={<Home />} />

      </Routes>
    </Router>
  );
}

export default App;