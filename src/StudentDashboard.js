import { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  getDoc
} from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {

  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [enrollLoading, setEnrollLoading] = useState(true);

  const navigate = useNavigate();

  const userId = user?.uid;

  // =====================
  // AUTH
  // =====================
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);

      if (!u) navigate("/login");
    });

    return () => unsub();
  }, [navigate]);

  // =====================
  // ENROLLMENTS
  // =====================
  useEffect(() => {
  if (!user) return;

  const load = async () => {
    setEnrollLoading(true);

    const emailKey = user.email.toLowerCase();

    // PRIMARY SYSTEM
    const ref = doc(db, "enrollments", emailKey);
    const snap = await getDoc(ref);

    let coursesList = [];

    if (snap.exists()) {
      coursesList = (snap.data().courses || []).map(c => c.toLowerCase());
    }

    // SECONDARY SYSTEM (Admin old data)
    const unsub = onSnapshot(collection(db, "studentEnrollments"), (snap2) => {
      const matches = snap2.docs
        .map(d => d.data())
        .filter(e => e.email === emailKey)
        .map(e => e.course.toLowerCase());

      const combined = [...new Set([...coursesList, ...matches])];

      setEnrolledCourses(combined);
      setEnrollLoading(false);
    });

    return () => unsub();
  };

  load();
}, [user]);

  // =====================
  // COURSES
  // =====================

useEffect(() => {
  if (enrollLoading) return;

  const loadCourses = async () => {
    const results = [];

    for (let courseId of enrolledCourses) {
      try {
        const ref = doc(db, "courses", courseId.toUpperCase());
        const snap = await getDoc(ref);

        if (snap.exists()) {
          results.push({
            id: snap.id,
            ...snap.data()
          });
        }
      } catch (err) {
        console.log("Blocked course:", courseId);
      }
    }

    setCourses(results);
  };

  loadCourses();
}, [enrolledCourses, enrollLoading]);
 // =====================
  // NORMALIZATION
  // =====================
 const selectedCourseData =
  courses.find(c => c.id === selectedCourse);

const selectedCourseName =
  selectedCourseData?.name?.toLowerCase();

const isEnrolled =
  selectedCourse &&
  enrolledCourses.includes(selectedCourse.toLowerCase());

  // =====================
// TOPICS (SECURE)
// =====================
useEffect(() => {
  if (!selectedCourse || !isEnrolled) {
    setTopics([]);
    return;
  }

  const unsub = onSnapshot(
    collection(db, "courses", selectedCourse, "topics"),
    (snap) => {
      setTopics(
        snap.docs.map(d => ({
          id: d.id,
          ...d.data()
        }))
      );
    },
    (error) => {
      console.log("Topics blocked:", error.message);
      setTopics([]);
    }
  );

  return () => unsub();
}, [selectedCourse, isEnrolled]);

  // =====================
  // LIVE SESSIONS
  // =====================
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "liveClasses"), (snap) => {
      setLiveSessions(
        snap.docs.map(d => ({
          id: d.id,
          ...d.data()
        }))
      );
    });

    return () => unsub();
  }, []);

  // =====================
  // LIVE FILTER
  // =====================
  const filteredSessions = selectedCourse
    ? liveSessions.filter(s =>
       s.course?.toLowerCase().trim() === selectedCourseName?.toLowerCase().trim()
      )
    : liveSessions;

  // =====================
  // STATUS
  // =====================
  const getSessionStatus = (session) => {
  if (!session.startedAt) return "upcoming";

  const now = new Date().getTime();

  const start =
    session.startedAt?.toDate?.().getTime?.() || now;

  const duration = session.duration || 60;

  const end = start + duration * 60000;

  if (now >= start && now <= end) return "live";
  if (now < start) return "upcoming";
  return "ended";
};

  // =====================
  // COMPLETE TOPIC
  // =====================
  const markAsCompleted = async (topicId, completedBy = []) => {
    if (!userId || !selectedCourse) return;
    if (completedBy?.includes(userId)) return;

    const ref = doc(db, "courses", selectedCourse, "topics", topicId);

    await updateDoc(ref, {
      completedBy: [...(completedBy || []), userId]
    });
  };

  // =====================
  // LOGOUT
  // =====================
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  // =====================
  // LOADING
  // =====================
  if (loading || enrollLoading) {
    return (
      <div style={center}>
        <h3>Loading LMS...</h3>
      </div>
    );
  }

  // =====================
  // PROGRESS
  // =====================
  const completedCount = topics.filter(t =>
    t.completedBy?.includes(userId)
  ).length;

  const progress = topics.length
    ? Math.round((completedCount / topics.length) * 100)
    : 0;

  // =====================
  // UI
  // =====================
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>

      <div style={sidebar}>
        <h2>🎓 LMS</h2>
        <p style={{ fontSize: 12 }}>{user?.email}</p>

        <hr />

        <button onClick={() => setSelectedCourse(null)} style={btnStyle(false)}>
          Home
        </button>

        {courses.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCourse(c.id)}
            style={btnStyle(selectedCourse === c.id)}
          >
            {c.name}
          </button>
        ))}

        <button onClick={handleLogout} style={logoutBtn}>
          Logout
        </button>
      </div>

      <div style={main}>

        <h1>Welcome 👋</h1>

        <div style={cardStyle}>
          <h2>🔴 Live Classes</h2>

          {filteredSessions.length === 0 ? (
            <p>No live sessions</p>
          ) : (
            Array.from(
  new Map(
    filteredSessions.map(s => [s.course?.toLowerCase(), s])
  ).values()
).map(s => {
              const status = getSessionStatus(s);

              return (
                <div key={s.id} style={cardStyle}>
                  <h4>
 {status === "live" && "🔴 LIVE "}
{status === "upcoming" && "⏳ "}
  {s.course?.toUpperCase() || "LIVE CLASS"}
</h4>

                {status === "live" && s.link && (
  <a href={s.link} target="_blank" rel="noreferrer" style={liveBtn}>
    Join Live
  </a>
)}
                </div>
              );
            })
          )}
        </div>

        {selectedCourse && !isEnrolled ? (
          <div style={cardStyle}>
            <h3>🔒 Not Enrolled</h3>
          </div>
        ) : selectedCourse && isEnrolled && (
          <div style={cardStyle}>
            <h3>📊 Progress</h3>

            <div style={progressBarBg}>
              <div style={{
                width: `${progress}%`,
                height: "100%",
                background: "green"
              }} />
            </div>

            <p>{progress}% completed</p>
          </div>
        )}

        {selectedCourse && isEnrolled && topics.map(t => {
          const done = t.completedBy?.includes(userId);

          return (
            <div key={t.id} style={cardStyle}>
              <h4>{t.title}</h4>
              <p>{t.content}</p>

              <button
                onClick={() => markAsCompleted(t.id, t.completedBy || [])}
                disabled={done}
                style={{
                  padding: 8,
                  background: done ? "gray" : "green",
                  color: "white",
                  border: "none"
                }}
              >
                {done ? "Completed" : "Mark Complete"}
              </button>
            </div>
          );
        })}

      </div>
    </div>
  );
}

// STYLES (UNCHANGED)
const center = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh"
};

const sidebar = {
  width: "260px",
  background: "#0f172a",
  color: "white",
  padding: "20px"
};

const main = {
  flex: 1,
  padding: 30,
  background: "#f1f5f9"
};

const btnStyle = (active) => ({
  width: "100%",
  padding: 10,
  marginBottom: 10,
  background: active ? "green" : "#1f2937",
  color: "white",
  border: "none"
});

const logoutBtn = {
  marginTop: 30,
  width: "100%",
  padding: 10,
  background: "red",
  color: "white",
  border: "none"
};

const cardStyle = {
  background: "white",
  padding: 20,
  borderRadius: 10,
  marginBottom: 15
};

const progressBarBg = {
  width: "100%",
  height: 15,
  background: "#ddd",
  borderRadius: 10,
  overflow: "hidden"
};

const liveBtn = {
  padding: 8,
  background: "red",
  color: "white",
  display: "inline-block",
  textDecoration: "none",
  borderRadius: 5
};