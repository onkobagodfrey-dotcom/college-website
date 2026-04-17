import { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

function App() {
  const [page, setPage] = useState("home");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful ✅");
      setPage("dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  const renderPage = () => {
    switch (page) {

      case "home":
        return (
          <div style={{ textAlign: "center" }}>
            <h2>Welcome to Gosotech Computer Training College 🎓</h2>
            <p>Empowering students with modern computer skills.</p>
          </div>
        );

      case "about":
        return <h2>About Us: We offer quality computer training.</h2>;

      case "courses":
        return <h2>Courses: ICT, Programming, Networking, Cyber Security</h2>;

      case "contact":
        return <h2>Contact us: 0700 000 000</h2>;

      case "login":
        return (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Student Login</h2>

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            /><br /><br />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            /><br /><br />

            <button
              onClick={loginUser}
              style={{
                padding: "10px 20px",
                backgroundColor: "#003366",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Login
            </button>
          </div>
        );

      case "dashboard":
        return (
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <h2>🎓 Student Dashboard</h2>

            <p>Welcome back, Student 👋</p>

            <div style={{ marginTop: "20px" }}>
              <div style={{ padding: "15px", backgroundColor: "#e6f0ff", margin: "10px", borderRadius: "10px" }}>
                <h3>📊 Progress</h3>
                <p>Completed Courses: 2</p>
              </div>

              <div style={{ padding: "15px", backgroundColor: "#e6ffe6", margin: "10px", borderRadius: "10px" }}>
                <h3>📚 Enrolled Courses</h3>
                <p>ICT, Programming</p>
              </div>

              <div style={{ padding: "15px", backgroundColor: "#ffe6e6", margin: "10px", borderRadius: "10px" }}>
                <h3>📅 Attendance</h3>
                <p>85%</p>
              </div>

              <button
                onClick={() => setPage("home")}
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  backgroundColor: "#003366",
                  color: "white",
                  border: "none",
                  borderRadius: "5px"
                }}
              >
                Logout
              </button>
            </div>
          </div>
        );

      default:
        return <h2>Home</h2>;
    }
  };

  return (
    <div style={{ fontFamily: "Arial" }}>
      <header style={{ backgroundColor: "#003366", color: "white", padding: "20px", textAlign: "center" }}>
        <h1>Gosotech Computer Training College</h1>
      </header>

      <nav style={{ backgroundColor: "#003366", padding: "10px", textAlign: "center" }}>
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("about")}>About</button>
        <button onClick={() => setPage("courses")}>Courses</button>
        <button onClick={() => setPage("contact")}>Contact</button>
        <button onClick={() => setPage("login")}>Login</button>
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
      </nav>

      <main style={{ padding: "20px", textAlign: "center" }}>
        {renderPage()}
      </main>

      <footer style={{ backgroundColor: "#003366", color: "white", padding: "10px", textAlign: "center" }}>
        <p>© 2026 Gosotech Computer Training College</p>
      </footer>
    </div>
  );
}

export default App;