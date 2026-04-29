import { auth, db } from "./firebase";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

export default function ProtectedRoute({ children }) {

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 ADMIN WHITELIST (backup security)
  const ADMIN_EMAILS = [
    "onkobagodfrey@gmail.com"
  ];

  // =====================
  // WAIT FOR AUTH STATE
  // =====================
  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged(async (u) => {

      setUser(u);

      if (!u) {
        setLoading(false);
        return;
      }

      try {
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setRole(snap.data().role);
        } else {
          setRole(null);
        }

      } catch (error) {
        console.error("Role fetch error:", error);
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();

  }, []);

  // =====================
  // LOADING STATE
  // =====================
  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <p>Loading...</p>
      </div>
    );
  }

  // =====================
  // NOT LOGGED IN
  // =====================
  if (!user) {
    return <Navigate to="/login" />;
  }

  // =====================
  // ADMIN CHECK (FALLBACK + FIRESTORE)
  // =====================
  const isAdmin =
    role === "admin" || ADMIN_EMAILS.includes(user.email);

  if (!isAdmin) {
    return (
      <div style={{
        padding: 20,
        textAlign: "center",
        marginTop: 50
      }}>
        <h2>❌ Access Denied</h2>
        <p>You are not authorized to access the admin panel.</p>
      </div>
    );
  }

  // =====================
  // ALLOW ACCESS
  // =====================
  return children;
}