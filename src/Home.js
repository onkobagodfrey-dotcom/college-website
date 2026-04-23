import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={styles.container}>

      {/* 🏫 LOGO */}
      <img src="/logo.jpg" alt="Gosotech Logo" style={styles.logo} />

      {/* 🏫 TITLE */}
      <h1 style={styles.title}>
        Gosotech Computer Training College
      </h1>

      <p style={styles.subtitle}>
        Welcome to the Learning Management System (LMS)
      </p>

      <hr style={styles.line} />

      {/* 🔘 BUTTONS */}
      <div style={styles.buttons}>
        <Link to="/login">
          <button style={styles.button}>Login</button>
        </Link>

        <Link to="/contact">
          <button style={styles.button}>Contact Us</button>
        </Link>
      </div>

      <hr style={styles.line} />

      {/* 📌 FOOTER */}
      <footer style={styles.footer}>
        © {new Date().getFullYear()} Gosotech Computer Training College
      </footer>

    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  container: {
    textAlign: "center",
    padding: 30,
    fontFamily: "Arial",
    background: "#f4f6f9",
    minHeight: "100vh"
  },
  logo: {
    width: 120,
    borderRadius: "50%",
    marginBottom: 10
  },
  title: {
    fontSize: "28px",
    margin: "10px 0",
    color: "#1a1a1a"
  },
  subtitle: {
    fontSize: "16px",
    color: "#555"
  },
  line: {
    margin: "20px 0"
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "20px"
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "white"
  },
  footer: {
    marginTop: 20,
    fontSize: "14px",
    color: "#777"
  }
};