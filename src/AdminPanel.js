import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot
} from "firebase/firestore";

export default function AdminPanel() {

  // =====================
  // STATE
  // =====================
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [topicTitle, setTopicTitle] = useState("");
  const [topicContent, setTopicContent] = useState("");

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
  // CREATE COURSE
  // =====================
  const addCourse = async () => {
    if (!courseTitle) return;

    await addDoc(collection(db, "courses"), {
      title: courseTitle
    });

    setCourseTitle("");
  };

  // =====================
  // ADD TOPIC
  // =====================
  const addTopic = async () => {
    if (!selectedCourse) return;
    if (!topicTitle || !topicContent) return;

    await addDoc(
      collection(db, "courses", selectedCourse, "topics"),
      {
        title: topicTitle,
        content: topicContent,
        completedBy: []
      }
    );

    setTopicTitle("");
    setTopicContent("");
  };

  // =====================
  // UI
  // =====================
  return (
    <div style={{ padding: 20 }}>

      <h2>🧑‍🏫 Admin Panel</h2>

      <hr />

      {/* CREATE COURSE */}
      <h3>📚 Create Course</h3>

      <input
        placeholder="Course Title"
        value={courseTitle}
        onChange={(e) => setCourseTitle(e.target.value)}
      />

      <button onClick={addCourse}>
        Add Course
      </button>

      <hr />

      {/* COURSES LIST */}
      <h3>📚 Courses</h3>

      {courses.map(c => (
        <div key={c.id} style={{ marginBottom: 10 }}>
          <button
            onClick={() => setSelectedCourse(c.id)}
            style={{
              background: selectedCourse === c.id ? "green" : "#eee",
              color: selectedCourse === c.id ? "white" : "black",
              padding: 5
            }}
          >
            {c.title}
          </button>
        </div>
      ))}

      <hr />

      {/* ADD TOPICS */}
      <h3>📖 Add Topics</h3>

      {!selectedCourse ? (
        <p>Select a course first</p>
      ) : (
        <>
          <input
            placeholder="Topic Title"
            value={topicTitle}
            onChange={(e) => setTopicTitle(e.target.value)}
          />

          <br />

          <textarea
            placeholder="Content"
            value={topicContent}
            onChange={(e) => setTopicContent(e.target.value)}
          />

          <br />

          <button onClick={addTopic}>
            Add Topic
          </button>
        </>
      )}

    </div>
  );
}