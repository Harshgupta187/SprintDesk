import { useState } from "react";
import toast from "react-hot-toast";
import { addIssue, getAllIssues } from "../services/issueService";
import { auth } from "../config/firebase";

export default function CreateIssue() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("");

  const createIssue = async () => {
    if (!title || !description || !priority || !assignedTo) {
      toast.error("All required fields must be filled");
      return;
    }

    const issues = await getAllIssues();
    const similar = issues.filter(i =>
      i.title.toLowerCase().includes(title.toLowerCase())
    );

    if (similar.length > 0) {
      const ok = window.confirm(
        `Similar issues found:\n${similar
          .map(i => "• " + i.title)
          .join("\n")}\n\nCreate anyway?`
      );
      if (!ok) return;
    }

    await addIssue({
      title,
      description,
      priority,
      status: "Open",
      assignedTo: assignedTo || auth.currentUser.email,
      createdBy: auth.currentUser.email
    });

    toast.success("Issue created successfully");
    setTitle("");
    setDescription("");
    setAssignedTo("");
    setPriority("");
  };

  return (
    <div className="w-full max-w-xl bg-slate-900/80 backdrop-blur p-8 rounded-2xl shadow-2xl border border-slate-800">
      <h2 className="text-xl font-semibold mb-6 text-center">
        Create New Issue
      </h2>

      <div className="space-y-4">
        <input
          className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700"
          placeholder="Title *"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700"
          placeholder="Description *"
          rows={4}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <input
          className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700"
          placeholder="Assigned To (email or name)"
          value={assignedTo}
          onChange={e => setAssignedTo(e.target.value)}
        />

        <select
          className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700"
          value={priority}
          onChange={e => setPriority(e.target.value)}
        >
          <option value="">Select Priority *</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button
          onClick={createIssue}
          className="w-full mt-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium transition"
        >
          Create Issue
        </button>
      </div>
    </div>
  );
}
