

import React, { useState } from "react";
import profilePhoto from "../../assets/Images/dummyprofile2.jpg";
import notification from "../../assets/Images/icons8-notification-50.png";
import expand from "../../assets/Images/sidebar.png";
import collapse from "../../assets/Images/sidebar (1).png";
import calendar from "../../assets/Images/icons8-calendar-week-100.png";
import Calendar from "../../CommonComponents/Calendar";
import closeicon from "../../assets/Images/icons8-close-60.png";
import profile from "../../assets/Images/icons8-profile-100.png"
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

interface ProfileSideBarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const ProfileSideBar: React.FC<ProfileSideBarProps> = ({ isCollapsed, onToggle }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

   const { name} = useSelector((state: RootState) => state.user);


  return (
    <>
      {/* DESKTOP SIDEBAR (lg and up) */}
      <div
        className={`hidden lg:flex ${
          isCollapsed ? "w-16" : "w-80"
        } bg-[#a5bdd2] shadow-lg flex-col transition-all duration-300 h-screen overflow-y-auto`}
      >
        {/* Collapse/Expand Button */}
        <div className="sticky top-0 z-10 bg-[#a5bdd2] p-4">
          <button
            onClick={onToggle}
            className="p-1 cursor-pointer rounded-full"
          >
            <img
              src={isCollapsed ? expand : collapse}
              alt="toggle sidebar"
              className="w-6 h-6"
            />
          </button>
        </div>

        {/* Collapsed View */}
        {isCollapsed && (
          <div className="flex flex-col items-center space-y-6 mt-4">
            <img
              src={profilePhoto}
              alt="Student"
              className="w-8 h-8 rounded-full object-cover cursor-pointer"
              // onClick={()=>{navigate("/ProfileDetails")}}
            />
            <img src={calendar} alt="calendar" className="w-8 h-8 cursor-pointer" />
            <img src={notification} alt="notification" className="w-8 h-8 cursor-pointer" />
          </div>
        )}

        {/* Expanded View */}
        {!isCollapsed && (
          <div className="p-4">
            {/* Profile Section */}
            <div className="flex flex-col items-center">
              <img
                src={profilePhoto}
                alt="Student"
                className="w-25 h-25 rounded-full border-4 border-blue-200 object-cover cursor-pointer"
                // onClick={()=>{navigate("/ProfileDetails")}}
              />
              <h2 className="mt-2 text-lg font-semibold text-white">{name||"harish"}</h2>
              <button className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition">
                Student
              </button>
            </div>

            {/* Calendar */}
            <div className="mt-6 w-full">
              <Calendar highlightedDates={{ 7: "red", 19: "blue", 29: "blue" }} />
            </div>

            {/* Reminders */}
            <div className="mt-6 w-full pb-6">
              <h3 className="text-sm font-semibold mb-2 text-white">Reminders</h3>
              <div className="space-y-3">
                {[
                  { title: "Eng - Vocabulary test", date: "12 Dec 2022, Friday" },
                  { title: "Eng - Essay", date: "15 Dec 2022, Monday" },
                  { title: "Eng - Speaking Class", date: "19 Dec 2022, Friday" },
                ].map((reminder, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg shadow-sm"
                  >
                    <img src={notification} alt="notification" className="w-5 h-5 mt-1" />
                    <div>
                      <p className="text-sm font-medium">{reminder.title}</p>
                      <p className="text-xs text-gray-500">{reminder.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE + TABLET (below lg) */}
      {!mobileOpen && (
        <button
          className="lg:hidden fixed top-4 right-4 z-50 bg-[#a5bdd2] "
          onClick={() => setMobileOpen(true)}
        >
          <img src={profile} alt="menu" className="h-6 w-6" />
        </button>
      )}

      {mobileOpen && (
        <div className="fixed inset-0 bg-[#a5bdd2] z-50 flex flex-col overflow-y-auto p-4">
          {/* Header with profile + close */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">Profile</h2>
            <button onClick={() => setMobileOpen(false)}>
              <img src={closeicon} alt="close" className="h-5 w-5" />
            </button>
          </div>

          {/* Profile Section */}
          <div className="flex flex-col items-center">
            <img
              src={profilePhoto}
              alt="Student"
              className="w-24 h-24 rounded-full border-4 border-blue-200 object-cover"
            />
            <h2 className="mt-2 text-lg font-semibold text-white">Harish</h2>
            <button className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition">
              Student
            </button>
          </div>

          {/* Calendar */}
          <div className="mt-6 w-full">
            <Calendar highlightedDates={{ 7: "red", 19: "blue", 29: "blue" }} />
          </div>

          {/* Reminders */}
          <div className="mt-6 w-full pb-6">
            <h3 className="text-sm font-semibold mb-2 text-white">Reminders</h3>
            <div className="space-y-3">
              {[
                { title: "Eng - Vocabulary test", date: "12 Dec 2022, Friday" },
                { title: "Eng - Essay", date: "15 Dec 2022, Monday" },
                { title: "Eng - Speaking Class", date: "19 Dec 2022, Friday" },
              ].map((reminder, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg shadow-sm"
                >
                  <img src={notification} alt="notification" className="w-5 h-5 mt-1" />
                  <div>
                    <p className="text-sm font-medium">{reminder.title}</p>
                    <p className="text-xs text-gray-500">{reminder.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSideBar;


