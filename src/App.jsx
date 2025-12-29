import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  updateDoc,
  doc
} from "firebase/firestore";
import { auth, db } from "./firebase";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [issues, setIssues] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, setUser);
    fetchIssues();
  }, []);

  /* ---------- AUTH ---------- */

  const signup = async () => {
    try {
      if (!email.includes("@")) throw new Error("Invalid email");
      if (password.length < 6) throw new Error("Password too short");
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
      alert(e.message);
    }
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      alert(e.message);
    }
  };

  /* ---------- ISSUES ---------- */

  const fetchIssues = async () => {
    const q = query(collection(db, "issues"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setIssues(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const createIssue = async () => {
    if (!title.trim() || !description.trim() || !priority) {
      alert("Title, Description and Priority are required");
      return;
    }

    const snap = await getDocs(collection(db, "issues"));
    const similarIssues = snap.docs.filter(d =>
      d.data().title.toLowerCase().includes(title.toLowerCase())
    );

    if (similarIssues.length > 0) {
      const names = similarIssues.map(i => `• ${i.data().title}`).join("\n");
      if (!window.confirm(`Similar issues found:\n${names}\n\nCreate anyway?`)) {
        return;
      }
    }

    await addDoc(collection(db, "issues"), {
      title,
      description,
      priority,
      status: "Open",
      assignedTo: assignedTo || user.email,
      createdBy: user.email,
      createdAt: Timestamp.now()
    });

    setTitle("");
    setDescription("");
    setPriority("");
    setAssignedTo("");
    fetchIssues();
  };

  const changeStatus = async (issue, next) => {
    if (issue.status === "Open" && next === "Done") {
      alert("Please move issue to In Progress before marking it Done.");
      return;
    }
    await updateDoc(doc(db, "issues", issue.id), { status: next });
    fetchIssues();
  };

  /* ---------- OPTION B FILTER ---------- */
  const filteredIssues = issues.filter(issue =>
    (!filterStatus
      ? issue.status !== "Done"
      : issue.status === filterStatus) &&
    (!filterPriority || issue.priority === filterPriority)
  );

  /* ---------- UI ---------- */

  if (!user) {
    return (
      <div className="page">
        <div className="card">
          <h2>SprintDesk</h2>
          <p className="subtitle">Smart Issue Board</p>

          <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />

          <div className="btn-group">
            <button className="primary" onClick={login}>Login</button>
            <button onClick={signup}>Sign Up</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card">
        <div className="header">
          <div>
            <h2>SprintDesk</h2>
            <p className="subtitle">{user.email}</p>
          </div>
          <button className="logout" onClick={() => signOut(auth)}>Logout</button>
        </div>

        <h3>Create Issue</h3>

        <input placeholder="Title *" value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder="Description *" value={description} onChange={e => setDescription(e.target.value)} />
        <input placeholder="Assigned To (optional)" value={assignedTo} onChange={e => setAssignedTo(e.target.value)} />

        {/* 🔽 FIXED PRIORITY DROPDOWN */}
        <select value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="" disabled>
            Select Priority
          </option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button className="primary" onClick={createIssue}>Create Issue</button>

        <h3>Issues</h3>

        <div className="row">
          <select onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Active (Default)</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>

          <select onChange={e => setFilterPriority(e.target.value)}>
            <option value="">All Priority</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        {filteredIssues.length === 0 && (
          <p className="empty">No issues found</p>
        )}

        {filteredIssues.map(issue => (
          <div key={issue.id} className="issue-card">
            <div className="issue-header">
              <strong>{issue.title}</strong>
              <span className={`badge ${issue.priority.toLowerCase()}`}>
                {issue.priority}
              </span>
            </div>

            <p>{issue.description}</p>
            <p className="meta">
              Status: {issue.status} • Assigned: {issue.assignedTo}
            </p>

            <select onChange={e => changeStatus(issue, e.target.value)}>
              <option>Open</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
