import { Priority } from './priority.enum';

export interface TodoResponse {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
