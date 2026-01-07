import { Outlet, Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import toast from "react-hot-toast";

export default function Dashboard() {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100">
      {/* Top Bar */}
      <header className="flex justify-between items-center px-8 py-5 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">SprintDesk</h1>
          <p className="text-sm text-slate-400">
            Logged in as{" "}
            <span className="text-blue-400">{user?.email}</span>
          </p>
        </div>

        {/* 🔹 ACTION BUTTONS */}
        <div className="flex gap-3">
          <Link
            to="/dashboard/create"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
          >
            Create Issue
          </Link>

          <Link
            to="/dashboard/issues"
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
          >
            All Issues
          </Link>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      

      {/* Page Content */}
      <main className="flex justify-center px-4 py-10">
        <Outlet />
      </main>
    </div>
  );
}
