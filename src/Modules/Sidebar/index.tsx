
// import React, { useState } from "react";
// import expand from "../../assets/Images/sidebar.png";
// import collapse from "../../assets/Images/sidebar (1).png";
// import profile from "../../assets/Images/user.png";
// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// import eaglerobot from "../../assets/Images/Eagle Robot Lab logo color (1).png"

// // icons

// import studentsPathway from "../../assets/Images/icons8-students-50.png";

// import indusLogo from "../../assets/Images/Indus logo (1).png";
// import closeicon from "../../assets/Images/icons8-close-60.png";
// import hamburger from "../../assets/Images/icons8-hamburger-100.png";

// interface SidebarProps {
//   isExpanded: boolean;
//   onToggle: () => void;
// }

// const Sidebar: React.FC<SidebarProps> = ({ isExpanded, onToggle, }) => {
//   const navigate = useNavigate();
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [showLogoutModal, setShowLogoutModal] = useState(false);

//   const handleLogout = () => {
//     Cookies.remove("userId");
//     navigate("/");
//   };

//   const menuItems = [
 
//     { label: "Personalized Students Pathway", icon: studentsPathway, path: "/StudentLearningPathway" },
  
//     // { label: "Dashboard", icon: schoolPolicies, path: "/Dashboard" },
//   ];

//   return (
//     <>
//       {/* DESKTOP SIDEBAR (only lg and up) */}
//       <div
//         className={`h-screen hidden lg:flex ${
//           isExpanded ? "w-56" : "w-20"
//         } bg-[#a5bdd2]
//  flex-col text-black transition-all duration-300`}
//       >
//         <div
//           className={`flex items-start ${
//             isExpanded ? "justify-between" : "justify-center"
//           } px-2`}
//         >
//           <div
//             className={`ps-[10%] ${isExpanded ? "w-[80%]" : "w-[0%]"} ${
//               isExpanded ? "h-[160px]" : "h-[80px]"
//             }`}
//           >
//             {isExpanded && <img src={indusLogo} alt="Logo"  />}
//              {isExpanded && <img src={eaglerobot} className="mt-4" alt="Logo" />}
//           </div>

//           <button className="mt-4" onClick={onToggle}>
//             <img
//               src={isExpanded ? collapse : expand}
//               alt="toggle"
//               className="h-5 w-5 cursor-pointer"
//             />
//           </button>
//         </div>

//         <div
//           className={`flex flex-col gap-6 mt-19 ${
//             isExpanded ? "items-start ps-[10%]" : "items-center ps-[0%]"
//           } text-sm`}
//         >
//           {menuItems.map((item, index) => (
//             <button
//               key={index}
//               className="flex items-center gap-2 hover:text-gray-200 cursor-pointer"
//               onClick={() => navigate(item.path)}
//             >
//               <div className="h-5 w-5">
//                 <img
//                   src={item.icon}
//                   alt={item.label}
//                   className="h-5 w-5 object-cover"
//                 />
//               </div>
//               {isExpanded && <span className="text-start">{item.label}</span>}
//             </button>
//           ))}
//         </div>

//         <div
//           className={`flex text-xs text-center ${
//             isExpanded ? "justify-between" : "justify-center"
//           } py-2 px-2 mt-auto`}
//         >
//           {isExpanded && "© 2025 Eagle Analytics"}
//           <div
//   onClick={() => {
//     setShowLogoutModal(true);
//   }}
// >
//             <img src={profile} alt="log out" className="h-4 w-4 cursor-pointer" />
//           </div>
//         </div>
//       </div>

//       {/* MOBILE + TABLET (below lg) */}
//       {!mobileOpen && (
//         <button
//           className="lg:hidden fixed top-3 left-3 z-50 bg-[#a5bdd2]"
//           onClick={() => setMobileOpen(true)}
//         >
//           <img src={hamburger} alt="menu" className="h-6 w-6" />
//         </button>
//       )}

//       {mobileOpen && (
//         <div className="fixed inset-0 bg-[#a5bdd2]
//  z-100 flex flex-col p-4">
//           {/* Header with logo + close */}
//           <div className="flex justify-between items-center mb-6">
//             <img src={indusLogo} alt="Logo" className="h-12" />
//             <button onClick={() => setMobileOpen(false)}>
//               <img src={closeicon} alt="close" className="h-5 w-5" />
//             </button>
//           </div>

//           {/* Menu items */}
//           <div className="flex flex-col gap-6 text-lg overflow-y-auto">
//             {menuItems.map((item, index) => (
//               <button
//                 key={index}
//                 className="flex items-center gap-3 hover:text-gray-200"
//                 onClick={() => {
//                   navigate(item.path);
//                   setMobileOpen(false);
//                 }}
//               >
//                 <img src={item.icon} alt={item.label} className="h-4 w-4" />
//                 <span className="text-sm">{item.label}</span>
//               </button>
//             ))}
//           </div>

//           {/* Footer */}
//           <div className="mt-auto flex justify-between items-center text-sm pt-2 ">
//             <span className="text-sm">© 2025 Eagle Analytics</span>
//             <button onClick={() => {setShowLogoutModal(true);
//               setMobileOpen(false)}}>
//               <img src={profile} alt="log out" className="h-3 w-3 cursor-pointer" />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* LOGOUT CONFIRMATION MODAL */}
//     {/* LOGOUT CONFIRMATION MODAL WITHOUT BLACK BACKGROUND */}
// {showLogoutModal && (
//   <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
//     <div className="bg-white rounded-lg p-6 w-80 max-w-xs text-center shadow-lg border border-gray-300">
//       <h2 className="text-lg font-semibold mb-4">Are you sure you want to logout?</h2>
//       <div className="flex justify-around mt-4">
//         <button
//           className="bg-[#a5bdd2] text-white px-4 py-2 rounded hover:bg-[#53825e] cursor-pointer"
//           onClick={handleLogout}
//         >
//           Yes
//         </button>
//         <button
//           className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
//           onClick={() => setShowLogoutModal(false)}
//         >
//           No
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//     </>
//   );
// };

// export default Sidebar;


// import React, { useState } from "react";
// import expand from "../../assets/Images/sidebar.png";
// import collapse from "../../assets/Images/sidebar (1).png";
// import profile from "../../assets/Images/user.png";
// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// import eaglerobot from "../../assets/Images/Eagle Robot Lab logo color (1).png"

// // // icons

// import studentsPathway from "../../assets/Images/icons8-students-50.png";

// // import indusLogo from "../../assets/Images/Indus logo (1).png";
// import closeicon from "../../assets/Images/icons8-close-60.png";
// import hamburger from "../../assets/Images/icons8-hamburger-100.png";

// interface SidebarProps {
//   isExpanded: boolean;
//   onToggle: () => void;
// }

// const Sidebar: React.FC<SidebarProps> = ({ isExpanded, onToggle, }) => {
//   const navigate = useNavigate();
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [showLogoutModal, setShowLogoutModal] = useState(false);

//   const handleLogout = () => {
//     Cookies.remove("userId");
//     navigate("/");
//   };

//   const menuItems = [
 
//     { label: "Personalized Students Pathway", icon: studentsPathway, path: "/StudentLearningPathway" },
  
//     // { label: "Dashboard", icon: schoolPolicies, path: "/Dashboard" },
//   ];

//   return (
//     <>
//       {/* DESKTOP SIDEBAR (only lg and up) */}
//       <div
//         className={`h-screen hidden lg:flex ${
//           isExpanded ? "w-56" : "w-20"
//         } bg-[#a5bdd2]
//  flex-col text-black transition-all duration-300`}
//       >
//         <div
//           className={`flex items-start ${
//             isExpanded ? "justify-between" : "justify-center"
//           } px-2`}
//         >
//           <div
//             className={`ps-[10%] ${isExpanded ? "w-[80%]" : "w-[0%]"} ${
//               isExpanded ? "h-[80px]" : "h-[30px]"
//             }`}
//           >
//             {/* {isExpanded && <img src={indusLogo} alt="Logo"  />} */}
//              {isExpanded && <img src={eaglerobot} className="mt-4" alt="Logo" />}
//           </div>

//           <button className="mt-4" onClick={onToggle}>
//             <img
//               src={isExpanded ? collapse : expand}
//               alt="toggle"
//               className="h-5 w-5 cursor-pointer"
//             />
//           </button>
//         </div>

//         <div
//           className={`flex flex-col gap-6 mt-19 ${
//             isExpanded ? "items-start ps-[10%]" : "items-center ps-[0%]"
//           } text-sm`}
//         >
//           {menuItems.map((item, index) => (
//             <button
//               key={index}
//               className="flex items-center gap-2 hover:text-gray-200 cursor-pointer"
//               onClick={() => navigate(item.path)}
//             >
//               <div className="h-5 w-5">
//                 <img
//                   src={item.icon}
//                   alt={item.label}
//                   className="h-5 w-5 object-cover"
//                 />
//               </div>
//               {isExpanded && <span className="text-start">{item.label}</span>}
//             </button>
//           ))}
//         </div>

//         <div
//           className={`flex text-xs text-center ${
//             isExpanded ? "justify-between" : "justify-center"
//           } py-2 px-2 mt-auto`}
//         >
//           {isExpanded && "© 2025 Eagle Analytics"}
//           <div
//   onClick={() => {
//     setShowLogoutModal(true);
//   }}
// >
//             <img src={profile} alt="log out" className="h-4 w-4 cursor-pointer" />
//           </div>
//         </div>
//       </div>

//       {/* MOBILE + TABLET (below lg) */}
//       {!mobileOpen && (
//         <button
//           className="lg:hidden fixed top-3 left-3 z-50 bg-[#a5bdd2]"
//           onClick={() => setMobileOpen(true)}
//         >
//           <img src={hamburger} alt="menu" className="h-6 w-6" />
//         </button>
//       )}

//       {mobileOpen && (
//         <div className="fixed inset-0 bg-[#a5bdd2]
//  z-100 flex flex-col p-4">
//           {/* Header with logo + close */}
//           <div className="flex justify-between items-center mb-6">
//             <img src={eaglerobot} alt="Logo" className="h-12" />
//             <button onClick={() => setMobileOpen(false)}>
//               <img src={closeicon} alt="close" className="h-5 w-5" />
//             </button>
//           </div>

//           {/* Menu items */}
//           <div className="flex flex-col gap-6 text-lg overflow-y-auto">
//             {menuItems.map((item, index) => (
//               <button
//                 key={index}
//                 className="flex items-center gap-3 hover:text-gray-200"
//                 onClick={() => {
//                   navigate(item.path);
//                   setMobileOpen(false);
//                 }}
//               >
//                 <img src={item.icon} alt={item.label} className="h-4 w-4" />
//                 <span className="text-sm">{item.label}</span>
//               </button>
//             ))}
//           </div>

//           {/* Footer */}
//           <div className="mt-auto flex justify-between items-center text-sm pt-2 ">
//             <span className="text-sm">© 2025 Eagle Analytics</span>
//             <button onClick={() => {setShowLogoutModal(true);
//               setMobileOpen(false)}}>
//               <img src={profile} alt="log out" className="h-3 w-3 cursor-pointer" />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* LOGOUT CONFIRMATION MODAL */}
//     {/* LOGOUT CONFIRMATION MODAL WITHOUT BLACK BACKGROUND */}
// {showLogoutModal && (
//   <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
//     <div className="bg-white rounded-lg p-6 w-80 max-w-xs text-center shadow-lg border border-gray-300">
//       <h2 className="text-lg font-semibold mb-4">Are you sure you want to logout?</h2>
//       <div className="flex justify-around mt-4">
//         <button
//           className="bg-[#a5bdd2] text-white px-4 py-2 rounded hover:bg-[#53825e] cursor-pointer"
//           onClick={handleLogout}
//         >
//           Yes
//         </button>
//         <button
//           className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
//           onClick={() => setShowLogoutModal(false)}
//         >
//           No
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//     </>
//   );
// };

// export default Sidebar;





import React, { useState } from "react";
import expand from "../../assets/Images/sidebar.png";
import collapse from "../../assets/Images/sidebar (1).png";
import profile from "../../assets/Images/user.png";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import eaglerobot from "../../assets/Images/Eagle Robot Lab logo color (1).png"

// icons
import assignments from "../../assets/Images/icons8-course-assign-48.png";
import learnerProfile from "../../assets/Images/icons8-learning-100.png";
import progressReport from "../../assets/Images/icons8-report-50.png";
import studentsPathway from "../../assets/Images/icons8-students-50.png";
import notifications from "../../assets/Images/icons8-notification-50.png";
import messaging from "../../assets/Images/icons8-chat-bubble-50.png";
import schoolPolicies from "../../assets/Images/insurance.png";
import indusLogo from "../../assets/Images/Indus logo (1).png";
import closeicon from "../../assets/Images/icons8-close-60.png";
import hamburger from "../../assets/Images/icons8-hamburger-100.png";

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, onToggle }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    Cookies.remove("userId");
    navigate("/");
  };

  const menuItems = [
    // { label: "Learner Profile", icon: learnerProfile, path: "/LearnerProfile" },
    { label: "Personalized Students Pathway", icon: studentsPathway, path: "/StudentLearningPathway" },
    // { label: "Resource and Assignments", icon: assignments, path: "/Assignments" },
    // { label: "Progress Report", icon: progressReport, path: "/ProgressReport" },
    // { label: "Notifications", icon: notifications, path: "/Notification" },
    // { label: "Messaging", icon: messaging, path: "/Messaging" },
    // { label: "School Policies", icon: schoolPolicies, path: "/SchoolPolicies" },
    // { label: "Dashboard", icon: schoolPolicies, path: "/Dashboard" },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR (only lg and up) */}
      <div
        className={`h-screen hidden lg:flex ${
          isExpanded ? "w-56" : "w-20"
        } bg-[#a5bdd2]
 flex-col text-black transition-all duration-300`}
      >
        <div
          className={`flex items-start ${
            isExpanded ? "justify-between" : "justify-center"
          } px-2`}
        >
          <div
            className={`ps-[10%] ${isExpanded ? "w-[80%]" : "w-[0%]"} ${
              isExpanded ? "h-[80px]" : "h-[30px]"
            }`}
          >
            {/* {isExpanded && <img src={indusLogo} alt="Logo"  />} */}
             {isExpanded && <img src={eaglerobot} className="mt-4" alt="Logo" />}
          </div>

          <button className="mt-4" onClick={onToggle}>
            <img
              src={isExpanded ? collapse : expand}
              alt="toggle"
              className="h-5 w-5 cursor-pointer"
            />
          </button>
        </div>

        <div
          className={`flex flex-col gap-6 mt-19 ${
            isExpanded ? "items-start ps-[10%]" : "items-center ps-[0%]"
          } text-sm`}
        >
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="flex items-center gap-2 hover:text-gray-200 cursor-pointer"
              onClick={() => navigate(item.path)}
            >
              <div className="h-5 w-5">
                <img
                  src={item.icon}
                  alt={item.label}
                  className="h-5 w-5 object-cover"
                />
              </div>
              {isExpanded && <span className="text-start">{item.label}</span>}
            </button>
          ))}
        </div>

        <div
          className={`flex text-xs text-center ${
            isExpanded ? "justify-between" : "justify-center"
          } py-2 px-2 mt-auto`}
        >
          {isExpanded && "© 2025 Eagle Analytics"}
          <div
  onClick={() => {
    setShowLogoutModal(true);
  }}
>
            <img src={profile} alt="log out" className="h-4 w-4 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* MOBILE + TABLET (below lg) */}
      {!mobileOpen && (
        <button
          className="lg:hidden fixed top-3 left-3 z-50 bg-[#a5bdd2]"
          onClick={() => setMobileOpen(true)}
        >
          <img src={hamburger} alt="menu" className="h-6 w-6" />
        </button>
      )}

      {mobileOpen && (
        <div className="fixed inset-0 bg-[#a5bdd2]
 z-100 flex flex-col p-4">
          {/* Header with logo + close */}
          <div className="flex justify-between items-center mb-6">
            <img src={indusLogo} alt="Logo" className="h-12" />
            <button onClick={() => setMobileOpen(false)}>
              <img src={closeicon} alt="close" className="h-5 w-5" />
            </button>
          </div>

          {/* Menu items */}
          <div className="flex flex-col gap-6 text-lg overflow-y-auto">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="flex items-center gap-3 hover:text-gray-200"
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
              >
                <img src={item.icon} alt={item.label} className="h-4 w-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-auto flex justify-between items-center text-sm pt-2 ">
            <span className="text-sm">© 2025 Eagle Analytics</span>
            <button onClick={() => {setShowLogoutModal(true);
              setMobileOpen(false)}}>
              <img src={profile} alt="log out" className="h-3 w-3 cursor-pointer" />
            </button>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
    {/* LOGOUT CONFIRMATION MODAL WITHOUT BLACK BACKGROUND */}
{showLogoutModal && (
  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
    <div className="bg-white rounded-lg p-6 w-80 max-w-xs text-center shadow-lg border border-gray-300">
      <h2 className="text-lg font-semibold mb-4">Are you sure you want to logout?</h2>
      <div className="flex justify-around mt-4">
        <button
          className="bg-[#a5bdd2] text-white px-4 py-2 rounded hover:bg-[#53825e] cursor-pointer"
          onClick={handleLogout}
        >
          Yes
        </button>
        <button
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
          onClick={() => setShowLogoutModal(false)}
        >
          No
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default Sidebar;








