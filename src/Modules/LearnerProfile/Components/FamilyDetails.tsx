// export interface Student {
 
//   fatherName: string;
//   fatherContact: string;
//   fatherEmail: string;
//   motherName: string;
//   motherContact: string;
//   motherEmail: string;
//   siblingInSchool: string; // Yes / No
//   siblingName: string;
//   siblingGradeSection: string;
// }

// interface FamilyDetailsProps {
//   student: Student;
//   onBack: () => void;
// }

// const FamilyDetails = ({ student, onBack }: FamilyDetailsProps) => {
//   return (
//     <div className="bg-gradient-to-r from-pink-200 to-red-200 text-gray-800 shadow-xl rounded-2xl p-8 w-full">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-center">Family Details</h2>
//         <button
//           onClick={onBack}
//           className="bg-pink-500 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-pink-600 transition"
//         >
//           Back
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <DetailItem label="Father's Name" value={student.fatherName} />
//         <DetailItem label="Father's Contact" value={student.fatherContact} />
//         <DetailItem label="Father's Email" value={student.fatherEmail} />
//         <DetailItem label="Mother's Name" value={student.motherName} />
//         <DetailItem label="Mother's Contact" value={student.motherContact} />
//         <DetailItem label="Mother's Email" value={student.motherEmail} />
//         <DetailItem label="Sibling in School" value={student.siblingInSchool} />
//         <DetailItem label="Sibling Name" value={student.siblingName} />
//         <DetailItem label="Sibling Grade & Section" value={student.siblingGradeSection} />
//       </div>
//     </div>
//   );
// };

// interface DetailItemProps {
//   label: string;
//   value: string;
// }

// const DetailItem = ({ label, value }: DetailItemProps) => (
//   <div className="flex flex-col bg-white p-4 rounded-lg shadow hover:shadow-md transition">
//     <span className="text-md font-bold text-gray-600">{label}</span>
//     <span className="text-sm text-gray-900">{value || "N/A"}</span>
//   </div>
// );

// export default FamilyDetails;
