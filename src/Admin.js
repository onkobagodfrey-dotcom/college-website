import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  getDoc
} from "firebase/firestore";

export default function Admin() {

  // =====================
  // STATES
  // =====================
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [email, setEmail] = useState("");

  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState("");

  const [topicTitle, setTopicTitle] = useState("");
  const [topicContent, setTopicContent] = useState("");
  const [topicCourse, setTopicCourse] = useState("");

  const [editId, setEditId] = useState(null);
  const [topics, setTopics] = useState([]);

  const [liveClasses, setLiveClasses] = useState([]);

  const [loading, setLoading] = useState(true);

  // =====================
  // STUDENTS
  // =====================
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "students"), (snap) => {
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // =====================
  // COURSES
  // =====================
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "courses"), (snap) => {
      setCourses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

  // =====================
  // TOPICS
  // =====================
  useEffect(() => {
    if (!topicCourse) {
      setTopics([]);
      return;
    }

    const unsub = onSnapshot(
      collection(db, "courses", topicCourse, "topics"),
      (snap) => {
        setTopics(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    );

    return () => unsub();
  }, [topicCourse]);

  // =====================
  // LIVE CLASSES
  // =====================
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "liveClasses"), (snap) => {
      setLiveClasses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

  // =====================
  // ADD COURSE
  // =====================
  const addCourse = async () => {
    if (!newCourse.trim()) return;

    const courseId = newCourse.trim().toLowerCase();

    await addDoc(collection(db, "courses"), {
      id: courseId,
      name: newCourse.trim()
    });

    setNewCourse("");
  };

  // =====================
  // ADD STUDENT (FIXED ENROLLMENT SYSTEM)
  // =====================
  const addStudent = async () => {
    if (!name || !course || !email) return;

    const uid = email.trim().toLowerCase();
    const courseId = course.toLowerCase();

    // =====================
    // 1. CREATE STUDENT PROFILE
    // =====================
    await setDoc(doc(db, "students", uid), {
      name: name.trim(),
      email: uid
    });

    // =====================
    // 2. CREATE / UPDATE ENROLLMENT
    // =====================
    const enrollRef = doc(db, "enrollments", uid);
    const snap = await getDoc(enrollRef);

    if (snap.exists()) {
      const existing = snap.data().courses || [];

      if (!existing.includes(courseId)) {
        await updateDoc(enrollRef, {
          courses: [...existing, courseId]
        });
      }
    } else {
      await setDoc(enrollRef, {
        courses: [courseId]
      });
    }

    setName("");
    setCourse("");
    setEmail("");
  };

  // =====================
  // DELETE STUDENT
  // =====================
  const deleteStudent = async (id) => {
    await deleteDoc(doc(db, "students", id));
  };

  // =====================
  // TOPIC ADD
  // =====================
  const addTopic = async () => {
    if (!topicTitle || !topicContent || !topicCourse) return;

    await addDoc(collection(db, "courses", topicCourse, "topics"), {
      title: topicTitle.trim(),
      content: topicContent.trim(),
      completedBy: []
    });

    setTopicTitle("");
    setTopicContent("");
  };

  // =====================
  // TOPIC UPDATE
  // =====================
  const updateTopic = async () => {
    if (!editId) return;

    await updateDoc(
      doc(db, "courses", topicCourse, "topics", editId),
      {
        title: topicTitle,
        content: topicContent
      }
    );

    setEditId(null);
  };

  // =====================
  // TOPIC DELETE
  // =====================
  const deleteTopic = async (id) => {
    await deleteDoc(doc(db, "courses", topicCourse, "topics", id));
  };

  const startEdit = (t) => {
    setEditId(t.id);
    setTopicTitle(t.title);
    setTopicContent(t.content);
  };

  // =====================
  // LIVE CLASS TOGGLE
  // =====================
  const toggleLiveClass = async (courseName) => {

    const active = liveClasses.find(
      l => l.course === courseName && l.isLive
    );

    if (active) {
      await updateDoc(doc(db, "liveClasses", active.id), {
        isLive: false,
        endedAt: new Date()
      });
      return;
    }

    await addDoc(collection(db, "liveClasses"), {
      course: courseName,
      isLive: true,
      startedAt: new Date(),
      link: "https://meet.google.com/new"
    });
  };

  // =====================
  // UI
  // =====================
  return (
    <div style={{ padding: 20, textAlign: "center" }}>

      <h2>🧑‍💻 LMS Admin Dashboard</h2>

      <hr />

      {/* COURSES */}
      <h3>📚 Add Course</h3>
      <input
        value={newCourse}
        onChange={(e) => setNewCourse(e.target.value)}
      />
      <button onClick={addCourse}>Add</button>

      <hr />

      {/* LIVE CLASSES */}
      <h3>🎥 Live Classes</h3>

      {courses.map(c => {
        const isLive = liveClasses.find(
          l => l.course === c.name && l.isLive
        );

        return (
          <div key={c.id}>
            <b>{c.name}</b>

            <button
              onClick={() => toggleLiveClass(c.name)}
              style={{
                marginLeft: 10,
                background: isLive ? "red" : "green",
                color: "white"
              }}
            >
              {isLive ? "STOP LIVE" : "START LIVE"}
            </button>

            {isLive && " 🔴 LIVE"}
          </div>
        );
      })}

      <hr />

      {/* TOPICS */}
      <h3>📖 Topics</h3>

      <select onChange={(e) => setTopicCourse(e.target.value)}>
        <option value="">Select Course</option>
        {courses.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <br /><br />

      <input
        placeholder="Title"
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

      <button onClick={editId ? updateTopic : addTopic}>
        {editId ? "Update" : "Add"}
      </button>

      <hr />

      {topics.map(t => (
        <div key={t.id}>
          <h4>{t.title}</h4>
          <button onClick={() => startEdit(t)}>Edit</button>
          <button onClick={() => deleteTopic(t.id)}>Delete</button>
        </div>
      ))}

      <hr />

      {/* STUDENTS */}
      <h3>👨‍🎓 Students</h3>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <select onChange={(e) => setCourse(e.target.value)}>
        <option value="">Select Course</option>
        {courses.map(c => (
          <option key={c.id} value={c.name.toLowerCase()}>
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

      {loading ? (
        <p>Loading...</p>
      ) : (
        students.map(s => (
          <div key={s.id}>
            {s.name} - {s.email}
            <button onClick={() => deleteStudent(s.id)}>Delete</button>
          </div>
        ))
      )}

    </div>
  );
}