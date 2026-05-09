import { useState } from "react";

export default function Students({
  students,
  courses,
  addStudent,
  deleteStudent
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");

  const handleAdd = () => {
    if (!name || !email || !course) return;

    addStudent(name, email, course);

    setName("");
    setEmail("");
    setCourse("");
  };

  return (
    <div>
      <h3>👨‍🎓 Students</h3>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <select value={course} onChange={(e) => setCourse(e.target.value)}>
        <option value="">Select Course</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
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

      <button onClick={handleAdd}>
        Add Student
      </button>

      <hr />

      <h3>👥 Students List</h3>

      {students.map((s) => (
        <div key={s.id} style={{ marginBottom: 10 }}>
          <b>{s.name}</b> - {s.email}

          <div>
            <small>
  Courses:{" "}
  {Array.isArray(s.courses) && s.courses.length > 0
    ? s.courses.join(", ")
    : "No courses enrolled"}
</small>
          </div>

          <button onClick={() => deleteStudent(s.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}