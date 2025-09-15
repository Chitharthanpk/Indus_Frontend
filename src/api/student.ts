// src/api/student.ts
import apiClient from "./apiClient";

function normalizeArrayResponse(data: any) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.results) return data.results;
  return [];
}

export async function getEnrollmentsByEmail(email: string) {
  const res = await apiClient.get("/api/enrollments/", { params: { search: email } });
  return normalizeArrayResponse(res.data);
}

export async function getEnrollmentById(enrollmentId: string) {
  const res = await apiClient.get(`/api/enrollments/${encodeURIComponent(enrollmentId)}/`);
  return res.data;
}

export async function getSubjectsByEnrollment(enrollmentId: string) {
  const res = await apiClient.get("/api/subjects/", { params: { search: enrollmentId } });
  return normalizeArrayResponse(res.data);
}

export async function getAssessmentsFAByEnrollment(enrollmentId: string) {
  const res = await apiClient.get(`/api/assessments/fa/${encodeURIComponent(enrollmentId)}/`);
  return normalizeArrayResponse(res.data);
}

export async function getAssessmentsSAByEnrollment(enrollmentId: string) {
  const res = await apiClient.get(`/api/assessments/sa/${encodeURIComponent(enrollmentId)}/`);
  return normalizeArrayResponse(res.data);
}

export async function getAssessmentsEOLByEnrollment(enrollmentId: string) {
  const res = await apiClient.get("/api/assessments/eol/", { params: { search: enrollmentId } });
  return normalizeArrayResponse(res.data);
}
