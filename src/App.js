import { useState } from "react";

function App() {
  const [page, setPage] = useState("home");

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

            <input id="user" placeholder="Username" /><br /><br />
            <input id="pass" type="password" placeholder="Password" /><br /><br />

            <button
              onClick={() => {
                const user = document.getElementById("user").value;
                const pass = document.getElementById("pass").value;

                if (user === "student" && pass === "1234") {
                  alert("Login successful ✅");
                  setPage("home");
                } else {
                  alert("Wrong username or password ❌");
                }
              }}
            >
              Login
            </button>
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