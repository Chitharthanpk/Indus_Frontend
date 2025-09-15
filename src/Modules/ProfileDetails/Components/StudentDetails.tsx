import React, { useState, useRef, useEffect, useCallback } from "react";
import PersonalDetails from "./PersonalDetails";
import FamilyDetails from "./FamilyDetails";
import ContactDetails from "./ContactDetails";

// StudentDetailsTabs.tsx
// Responsive tabbed student profile using TypeScript + React + Tailwind
// - Mobile: horizontal, scrollable tabs on top
// - Desktop (md+): left-aligned vertical sidebar tabs and content on the right
// - Improved spacing and responsive container widths

const StudentDetailsTabs: React.FC = () => {
  const [active, setActive] = useState<"personal" | "family" | "contact">("personal");

  const tabs: { id: "personal" | "family" | "contact"; label: string }[] = [
    { id: "personal", label: "Personal" },
    { id: "family", label: "Family" },
    { id: "contact", label: "Contact" },
  ];

  // sample data (move to props or context as needed)
  const student = {
    name: "John Doe",
    grade: "10",
    section: "A",
    email: "john.doe@example.com",
    nationality: "Indian",
    firstLanguage: "English",
    dateOfBirth: "2007-05-15",
    dateOfJoining: "2020-06-10",
    bloodGroup: "O+",
    allergies: "Peanuts",
    scholarType: "Day Scholar",
    boardingHouse: "N/A",
    transportDetails: "School Bus - Route 12",
    medicalIssues: "Asthma",
  };

  const familyDetails = {
    fatherName: "Michael Doe",
    fatherContact: "+91 9876543210",
    fatherEmail: "michael.doe@example.com",
    motherName: "Sarah Doe",
    motherContact: "+91 9123456789",
    motherEmail: "sarah.doe@example.com",
    siblingInSchool: "Yes",
    siblingName: "Emma Doe",
    siblingGradeSection: "Grade 5 - B",
  };

  const contactDetails = {
    permanentAddress: "123 Main Street, City, Country",
    currentAddress: "45 Residency Road, City, Country",
    emergencyPrimaryContact: "Mr. Robert Doe",
    emergencyEmail: "robert.doe@example.com",
    emergencyAlternateContact: "Mrs. Jane Doe",
    emergencyContactNumber: "+91 9876501234",
  };

  // refs for tab buttons
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // stable callback ref factory that returns a void callback (fixes TS2322)
  const setTabRef = useCallback(
    (index: number) => (el: HTMLButtonElement | null): void => {
      tabRefs.current[index] = el;
    },
    []
  );

  // keep focus on active tab when it changes
  useEffect(() => {
    const idx = tabs.findIndex((t) => t.id === active);
    const el = tabRefs.current[idx];
    if (el) el.focus();
  }, [active, tabs]);

  // keyboard navigation between tabs
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const idx = tabs.findIndex((t) => t.id === active);
      const next = e.key === "ArrowRight" ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
      setActive(tabs[next].id);
    }

    if (e.key === "Home") {
      e.preventDefault();
      setActive(tabs[0].id);
    }

    if (e.key === "End") {
      e.preventDefault();
      setActive(tabs[tabs.length - 1].id);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 py-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden md:flex">
          {/* Left sidebar on md+, top bar on mobile */}
          <aside className="w-full md:w-1/4 bg-gradient-to-b from-white to-gray-50 p-4 md:p-6">
            <div className="flex items-center justify-between md:block">
              <h2 className="text-xl font-semibold text-gray-800">Profile Details</h2>
              {/* optional small action on mobile */}
              <div className="md:hidden">
                <button
                  className="text-sm px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
                  onClick={() => setActive("personal")}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Tabs: horizontal scroll on small screens, vertical stack on md+ */}
            <div
              role="tablist"
              aria-label="Student detail tabs"
              onKeyDown={onKeyDown}
              className="mt-4 md:mt-6"
            >
              <div className="flex gap-3 md:flex-col overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                {tabs.map((t, i) => (
                  <button
                    key={t.id}
                    ref={setTabRef(i)}
                    role="tab"
                    aria-selected={active === t.id}
                    aria-controls={`panel-${t.id}`}
                    id={`tab-${t.id}`}
                    tabIndex={active === t.id ? 0 : -1}
                    onClick={() => setActive(t.id)}
                    className={`flex-shrink-0 md:flex-shrink-0 px-4 py-2 md:px-3 md:py-2 rounded-full md:rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition-all duration-200 whitespace-nowrap
                      ${
                        active === t.id
                          ? "bg-indigo-600 text-white shadow"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* optional quick info (visible on md+) */}
            <div className="hidden md:block mt-6 text-sm text-gray-600">
              <p className="font-medium">Student: <span className="font-normal">{student.name}</span></p>
              <p>Grade: {student.grade} • Section: {student.section}</p>
            </div>
          </aside>

          {/* Main content area */}
          <main className="w-full md:w-3/4 p-4 md:p-6">
            <div className="mb-4 md:hidden">
              {/* Show active tab label above content on mobile for context */}
              <p className="text-sm text-gray-600">Showing: <span className="font-medium text-gray-800">{active.charAt(0).toUpperCase() + active.slice(1)}</span></p>
            </div>

            <div className="bg-white rounded-lg">
              <section
                id="panel-personal"
                role="tabpanel"
                aria-labelledby="tab-personal"
                hidden={active !== "personal"}
                className={`${active === "personal" ? "block" : "hidden"} p-4 md:p-6`}
              >
                <PersonalDetails student={student} onBack={() => {}} />
              </section>

              <section
                id="panel-family"
                role="tabpanel"
                aria-labelledby="tab-family"
                hidden={active !== "family"}
                className={`${active === "family" ? "block" : "hidden"} p-4 md:p-6`}
              >
                <FamilyDetails student={familyDetails} onBack={() => {}} />
              </section>

              <section
                id="panel-contact"
                role="tabpanel"
                aria-labelledby="tab-contact"
                hidden={active !== "contact"}
                className={`${active === "contact" ? "block" : "hidden"} p-4 md:p-6`}
              >
                <ContactDetails student={contactDetails} onBack={() => {}} />
              </section>
            </div>

            {/* footer actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActive("personal")}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
              >
                Reset to Personal
              </button>

              <button
                type="button"
                onClick={() => alert('Edit action')}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:opacity-95 text-sm"
              >
                Edit
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsTabs;
