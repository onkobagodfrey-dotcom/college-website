import { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function StudentDashboard() {

  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  // 📥 COURSES
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "courses"), (snap) => {
      setCourses(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }))
      );
    });

    return () => unsub();
  }, []);

  // 📥 TOPICS
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "topics"), (snap) => {
      setTopics(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }))
      );
    });

    return () => unsub();
  }, []);

  return (
    <div style={{ padding: 20, textAlign: "center" }}>

      {/* 🔵 HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2>👨‍🎓 Student Dashboard</h2>

        <button
          onClick={() => auth.signOut()}
          className="btn"
        >
          Logout
        </button>
      </div>

      <p>Welcome to your LMS</p>

      <hr />

      {/* 📚 COURSES */}
      <h3>📚 Courses</h3>

      {courses.length === 0 ? (
        <p style={{ color: "red" }}>No courses found</p>
      ) : (
        courses.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCourse(c.name || c.title)}
            style={{
              margin: 5,
              padding: 10,
              cursor: "pointer"
            }}
          >
            {c.name || c.title}
          </button>
        ))
      )}

      <hr />

      {/* 📖 TOPICS */}
      <h3>📖 Topics</h3>

      {!selectedCourse ? (
        <p>Select a course to view topics</p>
      ) : topics.filter((t) => t.course === selectedCourse).length === 0 ? (
        <p style={{ color: "red" }}>No topics found for this course</p>
      ) : (
        topics
          .filter((t) => t.course === selectedCourse)
          .map((t) => (
            <div
              key={t.id}
              className="card"
              style={{ margin: 10 }}
            >
              <h4>{t.title}</h4>
              <p>{t.content}</p>
            </div>
          ))
      )}

    </div>
  );
}