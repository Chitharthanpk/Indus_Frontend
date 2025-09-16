// import  { useState } from "react";
// import calendar from "../../assets/Images/icons8-calendar-96.png";
// import star from "../../assets/Images/icons8-star-100.png";
// import girlstudent from "../../assets/Images/GirlStudents.jpg"

// const WelcomeHeader = ({ name, grade }: any) => {
//   const [academicYear, setAcademicYear] = useState("2025-2026");

//   return (
//     <div className="bg-white p-4 rounded-xl shadow-md w-full max-w-2xl flex flex-col gap-2">
//       {/* Row 1: Welcome + Academic Year */}
//       <div className="flex  items-center gap-2">
//         <h2 className="text-lg font-bold text-gray-800">
//           Welcome back {name}!
//         </h2>

       
//       </div>

//       {/* Row 2: Grade */}
//       <div className="flex gap-3 items-center">
//       <div className="bg-yellow-400 text-black text-sm font-semibold px-3 py-1 rounded-full shadow flex  gap-2 items-center w-fit h-fit">
//         <img src={star} alt="star" className="w-3 h-3" />
//         <span className="text-xs font-bold">{grade}</span>
//       </div>
//        <div className="bg-purple-50 p-2 rounded-lg flex items-center gap-2">
//           {/* Calendar Icon */}
//           <img src={calendar} alt="calendar" className="w-6 h-6" />

//           {/* Text stack: Academic Period + Year */}
//           <div className="flex flex-col">
//             <span className="text-sm font-medium text-purple-700">
//               Academic Period
//             </span>
//             <span className="text-xs font-semibold text-purple-900">
//               {academicYear}
//             </span>
//           </div>
//         </div>
//         </div>
//     </div>
//   );
// };

// export default WelcomeHeader;

// import { useState } from "react";
// import calendar from "../../assets/Images/icons8-calendar-96.png";
// import star from "../../assets/Images/icons8-star-100.png";
// import girlstudent from "../../assets/Images/books.png";

// const WelcomeHeader = ({ name, grade }: any) => {
//   const [academicYear, setAcademicYear] = useState("2025-2026");
  

//   return (
//     <div className="bg-white rounded-xl shadow-md w-full max-w-2xl flex items-center overflow-hidden ">
//       {/* Left Side: Text Content */}
//       <div className="flex flex-col justify-center gap-3 px-3 py-5 w-2/3">
//         {/* Row 1: Welcome */}
//         <h2 className="text-lg font-bold text-gray-800">
//           Welcome back {name}!
//         </h2>

//         {/* Row 2: Grade + Academic Period */}
//         <div className="flex gap-3 items-center">
//           <div className="bg-yellow-400 text-black text-sm font-semibold px-3 py-1 rounded-full shadow flex gap-2 items-center w-fit h-fit">
//             <img src={star} alt="star" className="w-3 h-3" />
//             <span className="text-xs font-bold">{grade}</span>
//           </div>

//           <div className="bg-purple-50 p-2 rounded-lg flex items-center gap-2">
//             {/* Calendar Icon */}
//             <img src={calendar} alt="calendar" className="w-6 h-6" />

//             {/* Text stack: Academic Period + Year */}
//             <div className="flex flex-col">
//               <span className="text-sm font-medium text-purple-700">
//                 Academic Period
//               </span>
//               <span className="text-xs font-semibold text-purple-900">
//                 {academicYear}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Right Side: Image */}
//       <div className="w-1/3 ">
//         <img
//           src={girlstudent}
//           alt="student"
//           className="w-full h-22 object-cover"
//         />
//       </div>
//     </div>
//   );
// };

// export default WelcomeHeader;



import { useState } from "react";
import calendar from "../../assets/Images/icons8-calendar-96.png";
import star from "../../assets/Images/icons8-star-100.png";
import induslogo from "../../assets/Images/Indus logo (1).png";

const WelcomeHeader = ({ name, grade }: any) => {
  const [academicYear] = useState("2025-2026");

  return (
    <div className="bg-white rounded-xl shadow-md w-full max-w-2xl flex items-center overflow-hidden">
      {/* Left Side */}
      <div className="flex flex-col justify-center gap-3 px-4 py-5 w-2/3">
        <h2 className="text-lg font-bold text-gray-800">Welcome back {name}!</h2>

        <div className="flex gap-3 items-center">
          <div className="bg-yellow-400 text-black text-sm font-semibold px-3 py-1 rounded-full shadow flex gap-2 items-center w-fit">
            <img src={star} alt="star" className="w-4 h-4" />
            <span className="text-xs font-bold">{grade}</span>
          </div>

          <div className="bg-purple-50 p-2 rounded-lg flex items-center gap-2">
            <img src={calendar} alt="calendar" className="w-6 h-6" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-purple-700">Academic Period</span>
              <span className="text-xs font-semibold text-purple-900">{academicYear}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Logo container (fixed square, prevents stretch/crop) */}
      <div className="w-1/3 flex items-center justify-center">
        <div className="bg-white/70  p-3 flex items-center justify-center
                        w-24 h-24 md:w-26 md:h-26 lg:w-30 lg:h-30">
          <img
            src={induslogo}
            alt="Indus logo"
            className="max-w-full max-h-full object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;

