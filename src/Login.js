import { useState } from "react";
import { auth, db } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCred.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        alert("User role not found. Contact admin.");
        setLoading(false);
        return;
      }

      const role = userSnap.data().role;

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "student") {
        navigate("/dashboard");
      } else {
        alert("Invalid role assigned");
      }

    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f4f6f9"
    }}>

      <div className="card" style={{ width: "300px", textAlign: "center" }}>

        <h2>🔐 LMS Login</h2>

        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn"
          onClick={handleLogin}
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{ marginTop: "10px", fontSize: "14px" }}>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>

      </div>
    </div>
  );
}