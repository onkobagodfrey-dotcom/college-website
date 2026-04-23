import { useState } from "react";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !password) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    try {
      // 1. Create user in Firebase Auth
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCred.user;

      // 2. Save role in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        role: "student"
      });

      alert("Registration successful!");
      navigate("/login"); // 🔴 FIXED (better flow)

    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div className="card" style={{ width: 300, textAlign: "center" }}>

        <h2>Student Registration</h2>

        <input
          className="input"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn"
          onClick={handleRegister}
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading ? "Creating..." : "Register"}
        </button>

        {/* 🔵 SAFE ADDITION */}
        <p style={{ marginTop: 10, fontSize: 14 }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f9"
  }
};