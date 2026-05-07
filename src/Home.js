import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.logoBox}>
          <img src="/logo.jpeg" alt="logo" style={styles.logo} />
          <h2 style={styles.brand}>Gosotech Training Institute - Smart LMS</h2>
        </div>

        <div>
          <button onClick={() => navigate("/login")} style={styles.loginBtn}>
            Login
          </button>
          <button onClick={() => navigate("/register")} style={styles.registerBtn}>
            Register
          </button>
        </div>
      </header>

      {/* HERO */}
      <section style={styles.hero}>
        <h1 style={styles.title}>
          Build Your Future with Digital Skills
        </h1>

        <p style={styles.subtitle}>
          Learn IC3, AIC3 and HSS courses with structured lessons, live classes, and progress tracking.
        </p>

        <div style={styles.cta}>
          <button onClick={() => navigate("/register")} style={styles.primaryBtn}>
            Get Started
          </button>

          <button onClick={() => navigate("/login")} style={styles.secondaryBtn}>
            Login
          </button>
        </div>
      </section>

      {/* COURSES */}
      <section style={styles.section}>
        <h2>Our Courses</h2>

        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>IC3</h3>
            <p>Digital literacy: Word, Excel, Internet, Email</p>
          </div>

          <div style={styles.card}>
            <h3>AIC3</h3>
            <p>Advanced digital skills and productivity tools</p>
          </div>

          <div style={styles.card}>
            <h3>HSS</h3>
            <p>Health Support Services professional training</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={styles.sectionLight}>
        <h2>Why Choose Us</h2>

        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>📚 Structured Learning</h3>
            <p>Step-by-step lessons for each course</p>
          </div>

          <div style={styles.card}>
            <h3>🎥 Live Classes</h3>
            <p>Attend real-time sessions with instructors</p>
          </div>

          <div style={styles.card}>
            <h3>📊 Progress Tracking</h3>
            <p>Monitor your course completion easily</p>
          </div>
        </div>
      </section>

      {/* ===================== */}
      {/* ✅ CONTACT SECTION ADDED */}
      {/* ===================== */}
      <section style={styles.contactSection}>
        <h2>Contact Us</h2>

        <p style={styles.contactText}>
          Have questions? Reach out to us anytime.
        </p>

        <div style={styles.contactBox}>

          <div>
            <h4>📞 Phone</h4>
            <p>+254 718 781 358</p>
          </div>
          <a
  href="https://wa.me/254736384606"
  target="_blank"
  rel="noreferrer"
  style={styles.whatsappBtn}
>
  💬
</a>

          <div>
            <h4>📧 Email</h4>
            <p>gitsupport@gmail.com</p>
          </div>

          <div>
            <h4>📍 Location</h4>
            <p>Sameta-Kisii, Kenya</p>
          </div>

        </div>

        <button
          style={styles.contactBtn}
          onClick={() => window.location.href = "mailto:gti@gmail.com"}
        >
          Send Message
        </button>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p>© {new Date().getFullYear()} Gosotech Training Institute - Smart LMS. All rights reserved.</p>
      </footer>

    </div>
  );
}

/* ===================== */
/* STYLES */
/* ===================== */

const styles = {
  page: {
    fontFamily: "Arial",
    background: "#5e0cf5"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "#2fee38",
    color: "white"
  },

  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: 10
  },

  logo: {
    width: 40,
    height: 40
  },

  brand: {
    margin: 0
  },

  loginBtn: {
    marginRight: 10,
    padding: "8px 15px",
    background: "green",
    border: "1px solid white",
    color: "white",
    cursor: "pointer"
  },

  registerBtn: {
    padding: "8px 15px",
    background: "#f52626",
    border: "none",
    color: "white",
    cursor: "pointer"
  },

  hero: {
    textAlign: "center",
    padding: "80px 20px"
  },

  title: {
    fontSize: 46,
    marginBottom: 13
  },

  subtitle: {
    fontSize: 18,
    color: "#ee1b1b",
    maxWidth: 600,
    margin: "0 auto 20px"
  },

  cta: {
    display: "flex",
    justifyContent: "center",
    gap: 15
  },

  primaryBtn: {
    padding: "12px 20px",
    background: "#2563eb",
    color: "white",
    border: "none",
    cursor: "pointer"
  },

  secondaryBtn: {
    padding: "12px 20px",
    background: "blue",
    border: "1px solid #2563eb",
    color: "#e8eb25ea",
    cursor: "pointer"
  },

  section: {
    padding: 40,
    textAlign: "center"
  },

  sectionLight: {
    padding: 40,
    textAlign: "center",
    background: "#0f0bf0"
  },

  cards: {
    display: "flex",
    justifyContent: "center",
    gap: 20,
    flexWrap: "wrap",
    marginTop: 20
  },

  card: {
    background: "white",
    padding: 20,
    width: 250,
    borderRadius: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  },

  /* ===================== */
  /* NEW CONTACT STYLES */
  /* ===================== */
  contactSection: {
    padding: 40,
    textAlign: "center",
    background: "#e79933fa"
  },

  contactText: {
    color: "#010914",
    marginBottom: 20
  },

  contactBox: {
    display: "flex",
    justifyContent: "center",
    gap: 40,
    flexWrap: "wrap",
    marginBottom: 20
  },

  contactBtn: {
    padding: "12px 20px",
    background: "#1dee0a",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: 5
  },

  footer: {
    textAlign: "center",
    padding: 20,
    background: "#f30e0e",
    color: "white",
    marginTop: 30
  }
};