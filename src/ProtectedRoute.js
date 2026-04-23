import { Navigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const user = auth.currentUser;

      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists() && snap.data().role === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) return <p>Checking access...</p>;

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
}