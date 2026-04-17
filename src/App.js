import { useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

function App() {
  const [page, setPage] = useState("home");
  const [students, setStudents] = useState([]);

  // 🔥 FETCH STUDENTS FROM FIRESTORE
  const fetchStudents = async () => {
    const data = await getDocs(collection(db, "students"));
    setStudents(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };

  // 📄 PAGE CONTENT
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

      case "dashboard":
        return (
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <h2>🎓 Student Dashboard</h2>

            <button
              onClick={fetchStudents}
              style={{
                padding: "10px",
                backgroundColor: "#003366",
                color: "white",
                border: "none",
                marginBottom: "20px"
              }}
            >
              Load Students
            </button>

            {students.length === 0 && <p>No students loaded yet.</p>}

            {students.map((s) => (
              <div
                key={s.id}
                style={{
                  margin: "10px auto",
                  padding: "10px",
                  border: "1px solid #ccc",
                  width: "300px",
                  borderRadius: "8px"
                }}
              >
                <h3>{s.name}</h3>
                <p>{s.email}</p>
                <p>Course: {s.course}</p>
                <p>Progress: {s.progress}%</p>
                <p>Attendance: {s.attendance}%</p>
              </div>
            ))}
          </div>
        );

      default:
        return <h2>Home</h2>;
    }
  };

  return (
    <div style={{ fontFamily: "Arial" }}>
      
      {/* HEADER */}
      <header style={{ backgroundColor: "#003366", color: "white", padding: "20px", textAlign: "center" }}>
        <h1>Gosotech Computer Training College</h1>
      </header>

      {/* NAVIGATION */}
      <nav style={{ backgroundColor: "#003366", padding: "10px", textAlign: "center" }}>
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("about")}>About</button>
        <button onClick={() => setPage("courses")}>Courses</button>
        <button onClick={() => setPage("contact")}>Contact</button>
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
      </nav>

      {/* PAGE CONTENT */}
      <main style={{ padding: "20px" }}>
        {renderPage()}
      </main>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#003366", color: "white", padding: "10px", textAlign: "center" }}>
        <p>© 2026 Gosotech Computer Training College</p>
      </footer>

    </div>
  );
}

export default App;