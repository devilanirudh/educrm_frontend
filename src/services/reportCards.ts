import api from './api';

export const getReportCardTemplates = async () => {
  const response = await api.get('/report-cards/templates');
  return response.data;
};

export const getReportCardTemplate = async (id: string) => {
  const response = await api.get(`/report-cards/templates/${id}`);
  return response.data;
};

export const createReportCardTemplate = async (data: any) => {
  const response = await api.post('/report-cards/templates', data);
  return response.data;
};

export const publishReportCard = async (data: any) => {
  const response = await api.post('/report-cards/publish', data);
  return response.data;
};

export const submitReportCard = async (data: any) => {
  const response = await api.post('/report-cards/submit', data);
  return response.data;
};

export const generateReportCardPdf = async (id: string) => {
  const response = await api.post(`/report-cards/generate-pdf`, { report_card_id: id });
  return response.data;
};

// You'll also need a way to get students for a class.
// This might already exist in another service, but I'll add it here for now.
export const getStudentsByClass = async (classId: string) => {
  const response = await api.get(`/classes/${classId}/students`);
  return response.data;
};

export const getSubmittedReportCards = async () => {
  const response = await api.get('/report-cards/submitted');
  return response.data;
};

export const approveReportCard = async (id: string) => {
  const response = await api.post(`/report-cards/${id}/approve`);
  return response.data;
};

export const getStudentReportCard = async (studentId: string) => {
  const response = await api.get(`/students/${studentId}/report-card`);
  return response.data;
};