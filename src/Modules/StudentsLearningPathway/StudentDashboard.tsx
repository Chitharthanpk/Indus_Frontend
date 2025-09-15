// src/Modules/StudentsLearningPathway/StudentDashboard.tsx
import React, { useEffect, useState } from "react";
import StudentPathway from "./Components";
import Cookies from "js-cookie";
import { getEnrollmentsByEmail } from "../../api/student";

/**
 * Wrapper component to ensure enrollments are fetched and persisted.
 * Keeps existing StudentPathway markup intact and only adds the data fetching layer.
 */
export default function StudentLearningPathWay() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadEnrollments() {
      setLoading(true);
      try {
        const rawUser = localStorage.getItem("user");
        const user = rawUser ? JSON.parse(rawUser) : null;
        const email = (user && (user.email || user.user_email)) || localStorage.getItem("userId") || Cookies.get("userId");

        if (!email) {
          if (mounted) setLoading(false);
          return;
        }

        const enrollments = await getEnrollmentsByEmail(email);
        if (!mounted) return;

        localStorage.setItem("enrollments", JSON.stringify(enrollments || []));

        // set default enrollment cookie if not set
        const existing = Cookies.get("enrollmentId");
        if (!existing && Array.isArray(enrollments) && enrollments.length > 0) {
          const first = enrollments[0];
          if (first.enrollment_id) {
            Cookies.set("enrollmentId", first.enrollment_id, { expires: 7 });
          }
        }
      } catch (err: any) {
        console.error("Failed to load enrollments:", err);
        if (mounted) setError(err?.message || "Failed to load student data");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadEnrollments();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen">
      {loading && <div className="p-2 text-center text-sm text-gray-600">Loading student data…</div>}
      {error && <div className="p-2 text-red-600">Error: {error}</div>}
      <StudentPathway />
    </div>
  );
}
