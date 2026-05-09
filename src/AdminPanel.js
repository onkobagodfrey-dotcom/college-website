import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

export default function AdminPanel() {

  // =====================
  // STATE
  // =====================
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  const [courseTitle, setCourseTitle] = useState("");
  const [topicTitle, setTopicTitle] = useState("");
  const [topicContent, setTopicContent] = useState("");
  const [topics, setTopics] = useState([]);

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
  // LOAD TOPICS (REALTIME)
  // =====================
  useEffect(() => {
    if (!selectedCourse) {
      setTopics([]);
      return;
    }

    const q = query(
      collection(db, "courses", selectedCourse, "topics"),
      orderBy("title")
    );

    const unsub = onSnapshot(q, (snap) => {
      setTopics(
        snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    });

    return () => unsub();
  }, [selectedCourse]);

  // =====================
  // CREATE COURSE
  // =====================
  const addCourse = async () => {
    if (!courseTitle.trim()) return;

    await addDoc(collection(db, "courses"), {
      name: courseTitle.trim(),
      createdAt: new Date()
    });

    setCourseTitle("");
  };

  // =====================
  // ADD TOPIC
  // =====================
  const addTopic = async () => {
    if (!selectedCourse) return;
    if (!topicTitle.trim() || !topicContent.trim()) return;

    await addDoc(
      collection(db, "courses", selectedCourse, "topics"),
      {
        title: topicTitle.trim(),
        content: topicContent.trim(),
        createdAt: new Date(),
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
              padding: 6
            }}
          >
            {c.name}
          </button>
        </div>
      ))}

      <hr />

      {/* TOPICS */}
      <h3>📖 Topics</h3>

      {!selectedCourse ? (
        <p>Select a course first</p>
      ) : (
        <>
          <input
            placeholder="Topic Title"
            value={topicTitle}
            onChange={(e) => setTopicTitle(e.target.value)}
          />

          <br /><br />

          <textarea
            placeholder="Content"
            value={topicContent}
            onChange={(e) => setTopicContent(e.target.value)}
          />

          <br /><br />

          <button onClick={addTopic}>
            Add Topic
          </button>

          <hr />

          {/* TOPIC LIST */}
          {topics.map(t => (
            <div key={t.id} style={{ marginBottom: 10 }}>
              <b>{t.title}</b>
              <p>{t.content}</p>
            </div>
          ))}
        </>
      )}

    </div>
  );
}