import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateIssue from "./pages/CreateIssue";
import Issues from "./pages/Issues";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="create" element={<CreateIssue />} />
        <Route path="issues" element={<Issues />} />
      </Route>
    </Routes>
  );
}
