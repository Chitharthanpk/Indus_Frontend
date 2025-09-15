import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";  // ✅ import persistor

import SubjectSummary from "./Modules/SubjectSummary/SubjectSummary";
import "./App.css";
import Login from "./Modules/LoginPage";
import Navbar from "./Modules/NavBar";
import Sidebar from "./Modules/Sidebar";
import ProfileSideBar from "./Modules/ProfileSidebar";

import StudentLearningPathWay from "./Modules/StudentsLearningPathway/StudentDashboard";
import { Assignments } from "./Modules/Assignments";
import { ProgressReport } from "./Modules/ProgressReport";
import { TimeTable } from "./Modules/TimeTable";
import { LearnerProfile } from "./Modules/LearnerProfile";
import { Messaging } from "./Modules/Messaging";
import { Notification } from "./Modules/Notification";
import { SchoolPolicies } from "./Modules/SchoolPolicies";
import { Dashboard } from "./Modules/Dashboard";
import { useState } from "react";
import Resources from "./Modules/Assignments/Components/Resources";
import Test from "./Modules/Assignments/Components/Test";
import Tasks from "./Modules/Assignments/Components/Tasks";
import { ProfileDetails } from "./Modules/ProfileDetails";

function AppContent() {
  const location = useLocation();

  // Login page should not show layout
  const isLoginPage = location.pathname === "/";

  // Centralized sidebar states
  const [isLeftExpanded, setIsLeftExpanded] = useState(false);
  const [isRightExpanded, setIsRightExpanded] = useState(false);

  // Toggle handlers ensuring only one can be open
  const toggleLeftSidebar = () => {
    setIsLeftExpanded((prev) => {
      if (!prev) setIsRightExpanded(false);
      return !prev;
    });
  };

  const toggleRightSidebar = () => {
    setIsRightExpanded((prev) => {
      if (!prev) setIsLeftExpanded(false);
      return !prev;
    });
  };

  if (isLoginPage) {
    return <Login />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar isExpanded={isLeftExpanded}  onToggle={toggleLeftSidebar} />

      {/* Center column */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Top Navbar */}
        <Navbar />

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-2 bg-gray-50">
          <Routes>
            <Route path="/StudentLearningPathway" element={<StudentLearningPathWay />} />
            <Route path="/subject-summary/:subject" element={<SubjectSummary    leftExpanded={isLeftExpanded}
      rightExpanded={isRightExpanded}/>} />
            <Route path="/Assignments" element={<Assignments />} />
            <Route path="/ProgressReport" element={<ProgressReport />} />
            <Route path="/TimeTable" element={<TimeTable />} />
            <Route path="/LearnerProfile" element={<LearnerProfile />} />
            <Route path="/Messaging" element={<Messaging />} />
            <Route path="/Notification" element={<Notification />} />
            <Route path="/SchoolPolicies" element={<SchoolPolicies />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/resources/:subject" element={<Resources />} />
             <Route path="/test/:subject" element={<Test />} />
               <Route path="/task/:subject" element={<Tasks />} />
               <Route path="/ProfileDetails" element={<ProfileDetails />} />
          </Routes>
        </div>
      </div>

      {/* Right Sidebar */}
      <ProfileSideBar isCollapsed={!isRightExpanded} onToggle={toggleRightSidebar} />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      {/* 🔹 PersistGate ensures Redux state rehydrates from storage */}
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <AppContent />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;


