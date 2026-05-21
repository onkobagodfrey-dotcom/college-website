import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import img1 from "./images/img1.jpg";
import img2 from "./images/img2.jpg";
import img3 from "./images/img3.jpg";
import img4 from "./images/img4.jpg";
import img5 from "./images/img5.jpg";
import img6 from "./images/img6.jpg";
import img7 from "./images/img7.jpg";
import logo from "./assets/logo.jpg";

const images = [img1, img2, img3, img4, img5, img6, img7];

export default function Home() {
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.page}>

     {/* HEADER */}
<header style={styles.header}>
  <div style={styles.logoBox}>
    <img src={logo} alt="logo" style={styles.logo} />
    <h2 style={styles.brand}>
      Gosotech Training Institute - Smart LMS
    </h2>
  </div>

  <div>
    <button onClick={() => navigate("/login")}>
      Login
    </button>
  </div>
</header>

      {/* SLIDESHOW */ }
  <div style={styles.banner}>
    <img
      src={images[index]}
      alt="slide"
      style={styles.image}
    />
  </div>

  {/* HERO */ }
  <section style={styles.hero}>
    <h1 style={styles.title}>
      Build Your Future with Digital Skills
    </h1>

    <p style={styles.subtitle}>
      Learn IC3, AIC3, HSS and OA courses with structured lessons,
      live classes, and progress tracking.
    </p>

    <div style={styles.cta}>
      <button
        onClick={() => navigate("/register")}
        style={styles.primaryBtn}
      >
        Register
      </button>

      <button
        onClick={() => navigate("/login")}
        style={styles.secondaryBtn}
      >
        Login
      </button>
    </div>
  </section>

  {/* COURSES */ }
  <section style={styles.section}>
    <h2>Our Courses</h2>

    <div style={styles.cards}>
      <div style={styles.card}>
        <h3>Internet and Computing Core Certification (IC3)</h3>
        <p>Introduction to Computers, Computer System, OS, Word, Excel, Access, Powerpoint, Computer Netwoks, Internet and Email</p>
      </div>

      <div style={styles.card}>
        <h3>Advanced Internet and Computing Core Certification (AIC3)</h3>
        <p>Command line interface, Data Representation, Advanced Word, Excel, Access, Powerpoint,  Data Security and Basic Computer Maintenance And Software Installation</p>
      </div>

       <div style={styles.card}>
        <h3>OFFICE ADMINISTRATION (OA)</h3>
        <p>Communication Skills, office Administration Practice, Computer Applications, Records and Information Management, Customer Care And Public Relations and Among Others </p>
      </div>


      <div style={styles.card}>
        <h3>HSS</h3>
        <p>Health Support Services professional training</p>
      </div>
    </div>
  </section>

  {/* FEATURES */ }
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

  {/* CONTACT */ }
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

      <div>
        <h4>📧 Email</h4>
        <p>gti@gmail.com</p>
      </div>

      <div>
        <h4>📍 Location</h4>
        <p>Sameta-Kisii, Kenya</p>
      </div>
    </div>

    <a
      href="https://wa.me/254736384606"
      target="_blank"
      rel="noreferrer"
      style={styles.whatsappBtn}
    >
      Reach us on WhatsApp
    </a>
  </section>

  {/* FOOTER */ }
  <footer style={styles.footer}>
    <p>
      © {new Date().getFullYear()} Gosotech Training Institute - Smart LMS
    </p>
  </footer>

    </div >
  );
}

const styles = {
  page: {
    fontFamily: "Arial",
    background: "#85c50d"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "#fa0606",
    color: "white"
  },

  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: 10
  },

  logo: {
    width: 45,
    height: 45,
    borderRadius: "50%"
  },

  brand: {
    margin: 0
  },

  loginBtn: {
    marginRight: 10,
    padding: "10px 18px",
    background: "green",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: 5
  },

  registerBtn: {
    padding: "10px 18px",
    background: "#f80909",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: 5
  },

  banner: {
    width: "100%",
    height: "350px",
    overflow: "hidden"
  },

  image: {
    width: "100%",
    height: "350px",
    objectFit: "cover"
  },

  hero: {
    textAlign: "center",
    padding: "60px 20px"
  },

  title: {
    fontSize: 42
  },

  subtitle: {
    fontSize: 18,
    maxWidth: 700,
    margin: "20px auto"
  },

  cta: {
    display: "flex",
    justifyContent: "center",
    gap: 15
  },

  primaryBtn: {
    padding: "12px 20px",
    background: "#f70f22",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer"
  },

  secondaryBtn: {
    padding: "12px 20px",
    background: "white",
    border: "1px solid #2563eb",
    borderRadius: 5,
    cursor: "pointer"
  },

  section: {
    padding: 40,
    textAlign: "center"
  },

  sectionLight: {
    padding: 40,
    textAlign: "center",
    background: "#f00af0"
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

  contactSection: {
    padding: 40,
    textAlign: "center"
  },

  contactText: {
    marginBottom: 20
  },

  contactBox: {
    display: "flex",
    justifyContent: "center",
    gap: 40,
    flexWrap: "wrap",
    marginBottom: 20
  },

  whatsappBtn: {
    display: "inline-block",
    padding: "12px 20px",
    background: "green",
    color: "white",
    textDecoration: "none",
    borderRadius: 5
  },

  footer: {
    textAlign: "center",
    padding: 20,
    background: "#f318c4",
    color: "white"
  }
};