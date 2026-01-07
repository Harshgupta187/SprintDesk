import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllIssues, updateStatus } from "../services/issueService";

export default function Issues() {
  const [issues, setIssues] = useState([]);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    setIssues(await getAllIssues());
  };

  const changeStatus = async (issue, next) => {
    if (issue.status === "Open" && next === "Done") {
      toast.error("Please move issue to In Progress before Done");
      return;
    }

    if (issue.status === "Done") {
      toast.error("Completed issues cannot be modified");
      return;
    }

    await updateStatus(issue.id, next);
    toast.success("Status updated");
    loadIssues();
  };

  // 🔹 Hide Done issues by default
  const filtered = issues.filter(issue =>
    (!status ? issue.status !== "Done" : issue.status === status) &&
    (!priority || issue.priority === priority)
  );

  const formatDate = (ts) => {
    if (!ts?.seconds) return "N/A";
    return new Date(ts.seconds * 1000).toLocaleString();
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-4xl font-semibold mb-2 text-center">
        All Issues
      </h2>

      <p className="text-xs text-slate-400 text-center mb-6">
        Completed (Done) issues are hidden by default
      </p>

      {/* Filters */}
      <div className="flex justify-center gap-4 mb-8">
        <select
          className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700"
          onChange={e => setStatus(e.target.value)}
        >
          <option value="">Active Issues</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>

        <select
          className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700"
          onChange={e => setPriority(e.target.value)}
        >
          <option value="">All Priority</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      {/* Issue Cards */}
      <div className="space-y-5">
        {filtered.map(issue => (
          <div
            key={issue.id}
            className="flex justify-between gap-6 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow"
          >
            {/* LEFT SIDE */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">
                  {issue.title}
                </h3>

                <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300">
                  {issue.priority}
                </span>
              </div>

              <p className="text-sm text-slate-300 mb-3">
                {issue.description}
              </p>

              <p className="text-xs text-slate-400 mb-3">
                Assigned To: {issue.assignedTo}
              </p>

              <select
                disabled={issue.status === "Done"}
                className={`px-3 py-2 rounded border 
                  ${issue.status === "Done"
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-slate-800 border-slate-700"}`}
                onChange={e => changeStatus(issue, e.target.value)}
              >
                <option>{issue.status}</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </div>

            
            <div className="w-56 text-right border-l border-slate-800 pl-4">
              <p className="text-xs text-slate-400 mb-1">
                Created By
              </p>
              <p className="text-sm text-slate-200 mb-4 break-words">
                {issue.createdBy || "N/A"}
              </p>

              <p className="text-xs text-slate-400 mb-1">
                Created At
              </p>
              <p className="text-sm text-slate-200">
                {formatDate(issue.createdAt)}
              </p>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-slate-400">
            No issues found
          </p>
        )}
      </div>
    </div>
  );
}
