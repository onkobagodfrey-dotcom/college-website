import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
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
} from "firebase/firestore";

export default function Admin() {

  // =====================
  // NAVIGATION + LOGOUT
  // =====================
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

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
  const [enrollments, setEnrollments] = useState([]);

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
  // ENROLLMENT TABLE
  // =====================
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "studentEnrollments"), (snap) => {
      setEnrollments(
        snap.docs.map(d => ({ id: d.id, ...d.data() }))
      );
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
  // ADD STUDENT (FIXED)
  // =====================
  const addStudent = async () => {
    if (!name || !course || !email) return;

    const uid = email.trim().toLowerCase();
    const courseId = course;

    await setDoc(doc(db, "students", uid), {
      name: name.trim(),
      email: uid
    });

    // Save enrollment record (clean structure)
    await setDoc(doc(db, "studentEnrollments", uid + "_" + courseId), {
      name: name.trim(),
      email: uid,
      course: courseId,
      createdAt: new Date()
    });

    setName("");
    setCourse("");
    setEmail("");
  };

  // =====================
  // DELETE STUDENT (FIXED)
  // =====================
  const deleteStudent = async (id, email) => {
    await deleteDoc(doc(db, "students", id));

    // remove enrollment rows linked to this student
    const q = enrollments.filter(e => e.email === email);

    for (let e of q) {
      await deleteDoc(doc(db, "studentEnrollments", e.id));
    }
  };

  // =====================
  // TOPIC FUNCTIONS
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

  const deleteTopic = async (id) => {
    await deleteDoc(doc(db, "courses", topicCourse, "topics", id));
  };

  const startEdit = (t) => {
    setEditId(t.id);
    setTopicTitle(t.title);
    setTopicContent(t.content);
  };

  // =====================
  // LIVE CLASS
  // =====================
  const toggleLiveClass = async (courseName) => {

  // 1. FIND ANY ACTIVE LIVE CLASS
  const activeSessions = liveClasses.filter(l => l.isLive);

  // 2. STOP ALL ACTIVE FIRST (IMPORTANT FIX)
  for (let session of activeSessions) {
    await updateDoc(doc(db, "liveClasses", session.id), {
      isLive: false,
      endedAt: new Date()
    });
  }

  // 3. START NEW ONE ONLY
  await addDoc(collection(db, "liveClasses"), {
    course: courseName,
    isLive: true,
    startedAt: new Date(),
    link: "https://meet.google.com/new"
  });

  window.open("https://meet.google.com/new", "_blank");
};

  // =====================
  // UI
  // =====================
  return (
    <div style={{ padding: 20, textAlign: "center" }}>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          padding: 10,
          background: "red",
          color: "white",
          border: "none",
          borderRadius: 5
        }}
      >
        Logout
      </button>

      <h2>🧑‍💻 LMS Admin Dashboard</h2>

      <hr />

      {/* COURSES */}
      <h3>📚 Add Course</h3>
      <input value={newCourse} onChange={(e) => setNewCourse(e.target.value)} />
      <button onClick={addCourse}>Add</button>

      <hr />

      {/* LIVE */}
      <h3>🎥 Live Classes</h3>

      {courses.map(c => {
        const isLive = liveClasses.find(
          l => l.course?.toLowerCase().trim() === c.name?.toLowerCase().trim()
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
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <br /><br />

      <input value={topicTitle} onChange={(e) => setTopicTitle(e.target.value)} />
      <br /><br />

      <textarea value={topicContent} onChange={(e) => setTopicContent(e.target.value)} />
      <br /><br />

      <button onClick={editId ? updateTopic : addTopic}>
        {editId ? "Update" : "Add"}
      </button>

      <hr />

      {/* STUDENTS */}
      <h3>👨‍🎓 Students</h3>

      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <br /><br />

      <select onChange={(e) => setCourse(e.target.value)}>
        <option value="">Select Course</option>
        {courses.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <br /><br />

      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <br /><br />

      <button onClick={addStudent}>Add Student</button>

      <hr />

      {/* ENROLLMENT TABLE */}
      <h3>📊 Student Enrollment Table</h3>

      <table border="1" cellPadding="10" style={{ margin: "0 auto", background: "white" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
          </tr>
        </thead>

        <tbody>
          {enrollments.map(e => (
            <tr key={e.id}>
              <td>{e.name}</td>
              <td>{e.email}</td>
              <td>{e.course}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      {/* STUDENT LIST */}
      <h3>👥 Students List</h3>

      {students.map(s => (
        <div key={s.id}>
          {s.name} - {s.email}
          <button onClick={() => deleteStudent(s.id, s.email)}>
            Delete
          </button>
        </div>
      ))}

    </div>
  );
}