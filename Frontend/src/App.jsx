import { Routes, Route, Router } from "react-router-dom";
import Homepage from "./pages/home/Homepage.jsx";
import SignUpPage from "./pages/auth/signup/SignUpPage.jsx";
import LoginPage from "./pages/auth/login/LoginPage.jsx";
import Sidebar from "./components/common/Sidebar.jsx";
import RightPanel from "./components/common/RightPanel.jsx";
import Notification from "./pages/notification/NotificationPage.jsx";

function App() {
  return (
    <div className="flex max-w-6xl mx-auto">
      {/* it is a comment component . */}
      <Sidebar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/notification" element={<Notification />} />
      </Routes>
      <RightPanel />
    </div>
  );
}

export default App;
