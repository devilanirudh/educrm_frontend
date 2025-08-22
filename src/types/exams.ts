export interface Exam {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  exam_id: string;
  class: {
    name: string;
  };
  subjects: {
    id: string;
    name: string;
  }[];
  exam_date: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
}