import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

export default function Topics({ courses }) {
  const [topicCourse, setTopicCourse] = useState("");
  const [topics, setTopics] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);

  // =====================
  // LOAD TOPICS
  // =====================
  useEffect(() => {
    if (!topicCourse) {
      setTopics([]);
      return;
    }

    const unsub = onSnapshot(
      collection(db, "courses", topicCourse, "topics"),
      (snap) => {
        setTopics(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        );
      }
    );

    return () => unsub();
  }, [topicCourse]);

  // =====================
  // ADD TOPIC
  // =====================
  const addTopic = async () => {
    if (!title || !content || !topicCourse) return;

    await addDoc(
      collection(db, "courses", topicCourse, "topics"),
      {
        title,
        content,
        createdAt: new Date()
      }
    );

    setTitle("");
    setContent("");
  };

  // =====================
  // UPDATE TOPIC
  // =====================
  const updateTopic = async () => {
    if (!editId) return;

    await updateDoc(
      doc(db, "courses", topicCourse, "topics", editId),
      {
        title,
        content
      }
    );

    setEditId(null);
    setTitle("");
    setContent("");
  };

  // =====================
  // DELETE TOPIC
  // =====================
  const deleteTopic = async (id) => {
    await deleteDoc(
      doc(db, "courses", topicCourse, "topics", id)
    );
  };

  // =====================
  // EDIT MODE
  // =====================
  const startEdit = (t) => {
    setEditId(t.id);
    setTitle(t.title);
    setContent(t.content);
  };

  return (
    <div>
      <h3>📖 Topics</h3>

      {/* COURSE SELECT */}
      <select
        onChange={(e) => setTopicCourse(e.target.value)}
      >
        <option value="">Select Course</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <br /><br />

      {/* INPUTS */}
      <input
        placeholder="Topic Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Topic Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <br /><br />

      <button onClick={editId ? updateTopic : addTopic}>
        {editId ? "Update Topic" : "Add Topic"}
      </button>

      <hr />

      {/* LIST */}
      {topics.map((t) => (
        <div key={t.id} style={{ marginBottom: 10 }}>
          <b>{t.title}</b>
          <p>{t.content}</p>

          <button onClick={() => startEdit(t)}>
            Edit
          </button>

          <button onClick={() => deleteTopic(t.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}