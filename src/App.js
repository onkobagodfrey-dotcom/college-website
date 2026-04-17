import { useState } from "react";

function App() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "home":
  return (
    <div style={{ textAlign: "center" }}>

      <h2 style={{ color: "#003366" }}>
        Welcome to Gosotech Computer Training College 🎓
      </h2>

      <p style={{ fontSize: "18px" }}>
        Empowering students with modern computer skills and technology training.
      </p>

      <div style={{ marginTop: "20px" }}>

        <div style={{ backgroundColor: "#e6f0ff", padding: "15px", margin: "10px", borderRadius: "10px" }}>
          <h3>📚 Quality Courses</h3>
          <p>ICT, Programming, Cyber Security, Networking</p>
        </div>

        <div style={{ backgroundColor: "#e6ffe6", padding: "15px", margin: "10px", borderRadius: "10px" }}>
          <h3>🧑‍🎓 Skilled Trainers</h3>
          <p>Learn from experienced instructors</p>
        </div>

        <div style={{ backgroundColor: "#ffe6e6", padding: "15px", margin: "10px", borderRadius: "10px" }}>
          <h3>💻 Practical Learning</h3>
          <p>Hands-on training with real systems</p>
        </div>

      </div>

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

      <nav style={{ backgroundColor: "#003366", padding: "10px", textAlign: "center" }}>
  <button onClick={() => setPage("home")}>Home</button>
  <button onClick={() => setPage("about")}>About</button>
  <button onClick={() => setPage("courses")}>Courses</button>
  <button onClick={() => setPage("contact")}>Contact</button>
  <button onClick={() => setPage("login")}>Login</button>
</nav>

      {/* PAGE CONTENT */}
      <main style={{ padding: "20px", textAlign: "center" }}>
        {renderPage()}
      </main>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#003366", color: "white", padding: "10px", textAlign: "center", marginTop: "30px" }}>
        <p>© 2026 Gosotech Computer Training College</p>
      </footer>

    </div>
  );
}

export default App;