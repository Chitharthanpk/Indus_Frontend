
export interface Student {
  name: string;
  grade: string;
  section: string;
  email: string;
  nationality: string;
  firstLanguage: string;
  dateOfBirth: string;
  dateOfJoining: string;
  bloodGroup: string;
  allergies: string;
  scholarType: string;
  boardingHouse: string;
  transportDetails: string;
  medicalIssues: string;
}

interface PersonalDetailsProps {
  student: Student;
  onBack: () => void;
}


const PersonalDetails = ({ student, onBack }: PersonalDetailsProps) => {
  return (
    <div className="bg-gradient-to-r from-indigo-300 to-purple-300 text-gray-800 shadow-xl rounded-2xl p-8 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-center">Personal Details</h2>
        <button
          onClick={onBack}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-600 transition cursor-pointer"
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailItem label="Name" value={student.name} />
        <DetailItem label="Grade" value={student.grade} />
        <DetailItem label="Section" value={student.section} />
        <DetailItem label="Email" value={student.email} />
        <DetailItem label="Nationality" value={student.nationality} />
        <DetailItem label="First Language" value={student.firstLanguage} />
        <DetailItem label="Date of Birth" value={student.dateOfBirth} />
        <DetailItem label="Date of Joining" value={student.dateOfJoining} />
        <DetailItem label="Blood Group" value={student.bloodGroup} />
        <DetailItem label="Allergies" value={student.allergies} />
        <DetailItem label="Scholar Type" value={student.scholarType} />
        <DetailItem label="Boarding House" value={student.boardingHouse} />
        <DetailItem label="Transport Details" value={student.transportDetails} />
        <DetailItem label="Medical Issues" value={student.medicalIssues} />
      </div>
    </div>
  );
};


interface DetailItemProps {
  label: string;
  value: string;
}

const DetailItem = ({ label, value }:DetailItemProps) => (
  <div className="flex flex-col bg-white/20 p-4 rounded-lg shadow">
    <span className="text-sm font-bold">{label}</span>
    <span className="text-base">{value || "N/A"}</span>
  </div>
);

export default PersonalDetails;
