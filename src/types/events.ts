export interface Event {
  id: number;
  title: string;
  description?: string;
  start: string;
  end: string;
  audience: 'all' | 'students' | 'teachers';
}