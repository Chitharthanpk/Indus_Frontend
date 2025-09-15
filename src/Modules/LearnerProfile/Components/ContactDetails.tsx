// export interface Student {
 
//   permanentAddress: string;
//   currentAddress: string;
//   emergencyPrimaryContact: string;
//   emergencyEmail: string;
//   emergencyAlternateContact: string;
//   emergencyContactNumber: string;
// }

// interface ContactDetailsProps {
//   student: Student;
//   onBack: () => void;
// }

// const ContactDetails = ({ student, onBack }: ContactDetailsProps) => {
//   return (
//     <div className="bg-gradient-to-r from-green-200 to-teal-200 text-gray-800 shadow-xl rounded-2xl p-8 w-full">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-center">Contact Details</h2>
//         <button
//           onClick={onBack}
//           className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition cursor-pointer"
//         >
//           Back
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <DetailItem label="Permanent Address" value={student.permanentAddress} />
//         <DetailItem label="Current Address" value={student.currentAddress} />
//         <DetailItem label="Emergency Contact (Primary)" value={student.emergencyPrimaryContact} />
//         <DetailItem label="Emergency Email" value={student.emergencyEmail} />
//         <DetailItem label="Emergency Contact (Alternate)" value={student.emergencyAlternateContact} />
//         <DetailItem label="Emergency Contact Number" value={student.emergencyContactNumber} />
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
//     <span className="text-sm font-semibold text-gray-600">{label}</span>
//     <span className="text-base font-medium text-gray-900">{value || "N/A"}</span>
//   </div>
// );

// export default ContactDetails;
