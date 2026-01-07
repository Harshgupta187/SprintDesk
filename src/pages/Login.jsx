import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "../config/firebase";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) navigate("/dashboard/create");
    });
  }, [navigate]);

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully");
      navigate("/dashboard/create");
    } catch (e) {
      toast.error(e.message);
    }
  };

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account created successfully");
      navigate("/dashboard/create");
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-2">SprintDesk</h1>
        <p className="text-sm text-slate-400 mb-6">
          Smart Issue Board
        </p>

        

        <input
          className="w-full mb-3 px-4 py-2 rounded bg-slate-800 border border-slate-700"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 px-4 py-2 rounded bg-slate-800 border border-slate-700"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            onClick={login}
            className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded"
          >
            Login
          </button>
          <button
            onClick={signup}
            className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
