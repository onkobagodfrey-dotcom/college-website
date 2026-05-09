import { signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import LiveClasses from "./LiveClasses";
import Students from "./Students";
import Topics from "./Topics";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot
} from "firebase/firestore";

export default function Admin() {
  const navigate = useNavigate();

  // ================= LOGOUT =================
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  // ================= STATES =================
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);

  const [newCourse, setNewCourse] = useState("");

  const [topicTitle, setTopicTitle] = useState("");
  const [topicContent, setTopicContent] = useState("");
  const [topicCourse, setTopicCourse] = useState("");
  const [editId, setEditId] = useState(null);

  // ================= FIRESTORE LISTENERS =================

  // STUDENTS (FIXED COLLECTION)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "enrollments"), (snap) => {
      setStudents(
        snap.docs.map(d => ({
          id: d.id,
          ...d.data()
        }))
      );
    });
    return unsub;
  }, []);

  // COURSES
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "courses"), (snap) => {
      setCourses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  // LIVE CLASSES
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "liveClasses"), (snap) => {
      setLiveClasses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  // ================= COURSES =================
  const addCourse = async () => {
    if (!newCourse.trim()) return;

    await addDoc(collection(db, "courses"), {
      name: newCourse.trim(),
      createdAt: new Date()
    });

    setNewCourse("");
  };

  // ================= STUDENT ENROLLMENT (FIXED) =================
  const addStudent = async (name, email, course) => {
    if (!name || !email || !course) return;

    const ref = doc(db, "enrollments", email.toLowerCase());
    const snap = await getDoc(ref);

    const existingCourses = snap.exists()
      ? snap.data().courses || []
      : [];

    await setDoc(ref, {
      name,
      email,
      courses: [...new Set([...existingCourses, course])],
      updatedAt: new Date()
    });
  };

  // ================= DELETE STUDENT =================
  const deleteStudent = async (id) => {
    await deleteDoc(doc(db, "enrollments", id));
  };

  // ================= LIVE CLASS TOGGLE =================
 const toggleLiveClass = async (courseId) => {

  // FIND CURRENT COURSE
  const current = liveClasses.find(
    (c) => c.course === courseId
  );

  // IF LIVE → STOP IT
  if (current && current.isLive) {

    await updateDoc(
      doc(db, "liveClasses", current.id),
      {
        isLive: false
      }
    );

    return;
  }

  // STOP ALL OTHER LIVE CLASSES
  const snap = await getDocs(
    collection(db, "liveClasses")
  );

  for (const d of snap.docs) {
    await updateDoc(
      doc(db, "liveClasses", d.id),
      {
        isLive: false
      }
    );
  }

  // START NEW LIVE CLASS
  await setDoc(
    doc(db, "liveClasses", courseId),
    {
      course: courseId,
      isLive: true,
      startedAt: new Date(),
      link: "https://meet.google.com/new"
    }
  );

  window.open(
    "https://meet.google.com/new",
    "_blank"
  );
};
  // ================= TOPICS =================
  const addTopic = async () => {
    if (!topicTitle || !topicContent || !topicCourse) return;

    await addDoc(collection(db, "courses", topicCourse, "topics"), {
      title: topicTitle,
      content: topicContent,
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

  // ================= UI =================
  return (
    <div style={{ padding: 20, textAlign: "center" }}>

      <button onClick={handleLogout}>Logout</button>

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
      <LiveClasses
        courses={courses}
        liveClasses={liveClasses}
        toggleLiveClass={toggleLiveClass}
      />

      <hr />

      {/* TOPICS */}
      <Topics
        courses={courses}
        topicTitle={topicTitle}
        setTopicTitle={setTopicTitle}
        topicContent={topicContent}
        setTopicContent={setTopicContent}
        topicCourse={topicCourse}
        setTopicCourse={setTopicCourse}
        addTopic={addTopic}
        updateTopic={updateTopic}
        editId={editId}
      />

      <hr />

      {/* STUDENTS */}
      <Students
        students={students}
        courses={courses}
        addStudent={addStudent}
        deleteStudent={deleteStudent}
      />

    </div>
  );
}