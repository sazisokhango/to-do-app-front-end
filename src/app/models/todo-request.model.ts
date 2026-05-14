import { Priority } from './priority.enum';

export interface TodoRequest {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
}
