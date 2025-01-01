import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/Dashboard";
import Meeting from "@/pages/Meeting";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meeting/:meetingId" element={<Meeting />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;