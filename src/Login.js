import { useState } from "react";
import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const ADMIN_EMAILS = [
    "onkobagodfrey@gmail.com"
  ];

  // =====================
  // LOGIN
  // =====================
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = userCred.user;

      const isAdmin = ADMIN_EMAILS.includes(user.email);
      const role = isAdmin ? "admin" : "student";

      // 🔥 CHECK BEFORE WRITING (prevents overwriting every login)
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, {
          email: user.email,
          role: role
        });
      }

      // 🚀 SAFE REDIRECT
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      if (error.code === "auth/user-not-found") {
        alert("Account not found. Please register.");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password.");
      } else if (error.code === "auth/invalid-credential") {
        alert("Invalid email or password.");
      } else {
        alert(error.message);
      }
    }

    setLoading(false);
  };

  // =====================
  // RESET PASSWORD
  // =====================
  const handleReset = async () => {
    if (!email) {
      alert("Enter your email first");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
      alert("Password reset email sent. Check your inbox.");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f4f6f9"
    }}>

      <div style={{
        width: "320px",
        textAlign: "center",
        background: "white",
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>

        <h2>🔐GOSOTECH LMS Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            background: loading ? "gray" : "green",
            color: "white",
            border: "none"
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          onClick={handleReset}
          style={{
            width: "100%",
            padding: 8,
            marginTop: 10,
            background: "orange",
            color: "white",
            border: "none"
          }}
        >
          Reset Password
        </button>

        <p style={{ marginTop: 10, fontSize: 14 }}>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>

      </div>
    </div>
  );
}