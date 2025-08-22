import { Exam } from '../types/exams';

const exams: Exam[] = [
  {
    id: '1',
    name: 'Midterm Exam',
    description: 'Midterm exam for all subjects',
    startDate: '2024-10-15',
    endDate: '2024-10-25',
    exam_id: 'EXM-001',
    class: { name: '10th Grade' },
    subjects: [{ id: '1', name: 'Math' }, { id: '2', name: 'Science' }],
    exam_date: '2024-10-15',
    status: 'Upcoming',
  },
  {
    id: '2',
    name: 'Final Exam',
    description: 'Final exam for all subjects',
    startDate: '2025-03-10',
    endDate: '2025-03-20',
    exam_id: 'EXM-002',
    class: { name: '12th Grade' },
    subjects: [{ id: '3', name: 'Physics' }, { id: '4', name: 'Chemistry' }],
    exam_date: '2025-03-10',
    status: 'Upcoming',
  },
];

export const examsService = {
  getExams: async (params: { page: number; per_page: number; search?: string }): Promise<{ data: Exam[]; total: number }> => {
    console.log('Fetching exams with params:', params);
    return Promise.resolve({ data: exams, total: exams.length });
  },
  deleteExam: async (id: string): Promise<void> => {
    console.log(`Deleting exam with id: ${id}`);
    const index = exams.findIndex((exam) => exam.id === id);
    if (index !== -1) {
      exams.splice(index, 1);
    }
    return Promise.resolve();
  },
};