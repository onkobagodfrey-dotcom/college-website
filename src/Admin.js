import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

export default function Admin() {

  // =====================
  // 👨‍🎓 STUDENTS
  // =====================
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [email, setEmail] = useState("");

  // =====================
  // 📚 COURSES
  // =====================
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState("");

  // =====================
  // 📖 TOPICS
  // =====================
  const [topicTitle, setTopicTitle] = useState("");
  const [topicContent, setTopicContent] = useState("");
  const [topicCourse, setTopicCourse] = useState("");

  const [loading, setLoading] = useState(true);

  // =====================
  // 📥 FETCH STUDENTS
  // =====================
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "students"), (snap) => {
      setStudents(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }))
      );
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // =====================
  // 📥 FETCH COURSES
  // =====================
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

  // =====================
  // ➕ ADD STUDENT
  // =====================
  const addStudent = async () => {
    if (!name || !course || !email) {
      alert("Fill all student fields");
      return;
    }

    await addDoc(collection(db, "students"), {
      name: name.trim(),
      course: course,
      email: email.trim()
    });

    setName("");
    setCourse("");
    setEmail("");
  };

  // =====================
  // ❌ DELETE STUDENT
  // =====================
  const deleteStudent = async (id) => {
    await deleteDoc(doc(db, "students", id));
  };

  // =====================
  // ➕ ADD COURSE
  // =====================
  const addCourse = async () => {
    if (!newCourse.trim()) return;

    await addDoc(collection(db, "courses"), {
      name: newCourse.trim()
    });

    setNewCourse("");
  };

  // =====================
  // ➕ ADD TOPIC
  // =====================
  const addTopic = async () => {
    if (!topicTitle || !topicContent || !topicCourse) {
      alert("Fill all topic fields");
      return;
    }

    await addDoc(collection(db, "topics"), {
      title: topicTitle.trim(),
      content: topicContent.trim(),
      course: topicCourse
    });

    setTopicTitle("");
    setTopicContent("");
    setTopicCourse("");
  };

  // =====================
  // UI
  // =====================
  return (
    <div style={{ padding: 20, textAlign: "center" }}>

      <h2>🧑‍💻 LMS Admin Dashboard</h2>

      <hr />

      {/* ================= COURSES ================= */}
      <h3>📚 Add Course</h3>

      <input
        placeholder="Course name (e.g ICT)"
        value={newCourse}
        onChange={(e) => setNewCourse(e.target.value)}
      />

      <button onClick={addCourse}>Add Course</button>

      <hr />

      {/* ================= TOPICS ================= */}
      <h3>📖 Add Topic</h3>

      <select
        value={topicCourse}
        onChange={(e) => setTopicCourse(e.target.value)}
      >
        <option value="">Select Course</option>
        {courses.map((c) => (
          <option key={c.id} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      <br /><br />

      <input
        placeholder="Topic title"
        value={topicTitle}
        onChange={(e) => setTopicTitle(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Topic content"
        value={topicContent}
        onChange={(e) => setTopicContent(e.target.value)}
      />

      <br /><br />

      <button onClick={addTopic}>Add Topic</button>

      <hr />

      {/* ================= STUDENTS ================= */}
      <h3>👨‍🎓 Add Student</h3>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      {/* ✅ FIXED COURSE DROPDOWN */}
      <select
        value={course}
        onChange={(e) => setCourse(e.target.value)}
      >
        <option value="">Select Course</option>
        {courses.map((c) => (
          <option key={c.id} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      <br /><br />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <button onClick={addStudent}>Add Student</button>

      <hr />

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading students...</p>
      ) : (
        <table border="1" style={{ margin: "auto", width: "90%" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Course</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.course}</td>
                <td>{s.email}</td>
                <td>
                  <button onClick={() => deleteStudent(s.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}