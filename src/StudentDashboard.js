import { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc
} from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function StudentDashboard() {

  // =====================
  // STATE
  // =====================
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // =====================
  // LOAD COURSES
  // =====================
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "courses"), (snap) => {
      setCourses(
        snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    });

    return () => unsub();
  }, []);

  // =====================
  // LOAD TOPICS (INSIDE COURSE)
  // =====================
  useEffect(() => {
    if (!selectedCourse) return;

    const unsub = onSnapshot(
      collection(db, "courses", selectedCourse, "topics"),
      (snap) => {
        setTopics(
          snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        );
      }
    );

    return () => unsub();
  }, [selectedCourse]);

  // =====================
  // MARK AS COMPLETED
  // =====================
  const markAsCompleted = async (topicId, completedBy = []) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    if (completedBy?.includes(userId)) return;

    const ref = doc(
      db,
      "courses",
      selectedCourse,
      "topics",
      topicId
    );

    await updateDoc(ref, {
      completedBy: [...(completedBy || []), userId]
    });
  };

  // =====================
  // PROGRESS CALCULATION
  // =====================
  const completedCount = topics.filter(t =>
    t.completedBy?.includes(auth.currentUser?.uid)
  ).length;

  const progress = topics.length
    ? Math.round((completedCount / topics.length) * 100)
    : 0;

  // =====================
  // UI
  // =====================
  return (
    <div style={{ padding: 20 }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2>🎓 Student Dashboard</h2>

        <button onClick={() => signOut(auth)}>
          Logout
        </button>
      </div>

      <p>Welcome back 👋</p>

      <hr />

      {/* COURSES */}
      <h3>📚 Courses</h3>

      {courses.length === 0 ? (
        <p>No courses available</p>
      ) : (
        courses.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCourse(c.id)}
            style={{
              margin: 5,
              padding: 10,
              background: selectedCourse === c.id ? "#4CAF50" : "#eee",
              color: selectedCourse === c.id ? "white" : "black",
              border: "none",
              cursor: "pointer"
            }}
          >
            {c.title}
          </button>
        ))
      )}

      <hr />

      {/* PROGRESS */}
      {selectedCourse && (
        <>
          <h3>📊 Progress</h3>

          <div style={{
            width: "100%",
            background: "#ddd",
            borderRadius: 10,
            overflow: "hidden",
            marginBottom: 15
          }}>
            <div style={{
              width: `${progress}%`,
              background: "green",
              color: "white",
              textAlign: "center",
              padding: 5
            }}>
              {progress}%
            </div>
          </div>
        </>
      )}

      {/* TOPICS */}
      <h3>📖 Topics</h3>

      {!selectedCourse ? (
        <p>Select a course to view topics</p>
      ) : topics.length === 0 ? (
        <p>No topics found</p>
      ) : (
        topics.map(t => {
          const isDone = t.completedBy?.includes(auth.currentUser?.uid);

          return (
            <div
              key={t.id}
              style={{
                border: "1px solid #ccc",
                padding: 10,
                marginBottom: 10,
                borderRadius: 8
              }}
            >
              <h4>{t.title}</h4>
              <p>{t.content}</p>

              <button
                onClick={() => markAsCompleted(t.id, t.completedBy || [])}
                disabled={isDone}
                style={{
                  background: isDone ? "gray" : "green",
                  color: "white",
                  padding: "5px 10px",
                  cursor: isDone ? "not-allowed" : "pointer"
                }}
              >
                {isDone ? "✅ Completed" : "Mark as Completed"}
              </button>
            </div>
          );
        })
      )}

    </div>
  );
}