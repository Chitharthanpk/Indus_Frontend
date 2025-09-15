// import { useState } from "react";
// import PersonalDetails from "./PersonalDetails";
// import FamilyDetails from "./FamilyDetails";
// import ContactDetails from "./ContactDetails";

// const StudentDetails = () => {
//   // Explicit type for activeSection
//   const [activeSection, setActiveSection] = useState<"personal" | "family" | "contact" | null>(null);

//   const student = {
//     name: "John Doe",
//     grade: "10",
//     section: "A",
//     email: "john.doe@example.com",
//     nationality: "Indian",
//     firstLanguage: "English",
//     dateOfBirth: "2007-05-15",
//     dateOfJoining: "2020-06-10",
//     bloodGroup: "O+",
//     allergies: "Peanuts",
//     scholarType: "Day Scholar",
//     boardingHouse: "N/A",
//     transportDetails: "School Bus - Route 12",
//     medicalIssues: "Asthma",
//   };

//   const familyDetails = {
//   name: "John Doe",
//   grade: "10",
//   section: "A",
//   email: "john.doe@example.com",
//   nationality: "Indian",
//   firstLanguage: "English",
//   dateOfBirth: "2007-05-15",
//   dateOfJoining: "2020-06-10",
//   bloodGroup: "O+",
//   allergies: "Peanuts",
//   scholarType: "Day Scholar",
//   boardingHouse: "N/A",
//   transportDetails: "School Bus - Route 12",
//   medicalIssues: "Asthma",

//   fatherName: "Michael Doe",
//   fatherContact: "+91 9876543210",
//   fatherEmail: "michael.doe@example.com",
//   motherName: "Sarah Doe",
//   motherContact: "+91 9123456789",
//   motherEmail: "sarah.doe@example.com",
//   siblingInSchool: "Yes",
//   siblingName: "Emma Doe",
//   siblingGradeSection: "Grade 5 - B",
// };

// const contactDetails={
//   // ...personal + family
//   permanentAddress: "123 Main Street, City, Country",
//   currentAddress: "45 Residency Road, City, Country",
//   emergencyPrimaryContact: "Mr. Robert Doe",
//   emergencyEmail: "robert.doe@example.com",
//   emergencyAlternateContact: "Mrs. Jane Doe",
//   emergencyContactNumber: "+91 9876501234",
// };



//   return (
//     <div className="min-h-screen w-full flex justify-center items-center bg-gray-100">
//       <div className="flex flex-col gap-6 w-full max-w-4xl items-center">
        
//         <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
//           Learner Profile
//         </h1>

//         {/* Show cards only if no section is active */}
//         {!activeSection && (
//           <>
//             <div
//               onClick={() => setActiveSection("personal")}
//               className="cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-500 w-[60%] text-white shadow-lg rounded-2xl p-8 flex justify-center items-center hover:scale-105 transition-transform duration-300"
//             >
//               <h2 className="text-2xl font-bold text-center">Personal Details</h2>
//             </div>

//             <div
//               onClick={() => setActiveSection("family")}
//               className="cursor-pointer bg-gradient-to-r from-pink-500 to-red-500 w-[60%] text-white shadow-lg rounded-2xl p-8 flex justify-center items-center hover:scale-105 transition-transform duration-300"
//             >
//               <h2 className="text-2xl font-bold text-center">Family Details</h2>
//             </div>

//             <div
//               onClick={() => setActiveSection("contact")}
//               className="cursor-pointer bg-gradient-to-r from-green-500 to-teal-500 w-[60%] text-white shadow-lg rounded-2xl p-8 flex justify-center items-center hover:scale-105 transition-transform duration-300"
//             >
//               <h2 className="text-2xl font-bold text-center">Contact Details</h2>
//             </div>
//           </>
//         )}

//         {/* Render PersonalDetails */}
//         {activeSection === "personal" && (
//           <PersonalDetails student={student} onBack={() => setActiveSection(null)} />
//         )}
//         {activeSection === "family" && (
//   <FamilyDetails student={familyDetails} onBack={() => setActiveSection(null)} />
// )}
// {activeSection === "contact" && (
//   <ContactDetails student={contactDetails} onBack={() => setActiveSection(null)} />
// )}

//       </div>
//     </div>
//   );
// };

// export default StudentDetails;
