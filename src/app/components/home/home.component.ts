import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { TodoResponse } from '../../models/todo-response.model';
import { TodoRequest } from '../../models/todo-request.model';
import { Priority } from '../../models/priority.enum';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoFormComponent } from '../todo-form/todo-form.component';

interface DateGroup {
  date: string;
  incomplete: TodoResponse[];
  complete: TodoResponse[];
}

const PRIORITY_ORDER: Record<Priority, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

@Component({
  selector: 'app-home',
  imports: [TodoItemComponent, TodoFormComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private readonly todoService = inject(TodoService);

  readonly todos = signal<TodoResponse[]>([]);
  readonly showForm = signal(false);
  readonly editingTodo = signal<TodoResponse | null>(null);
  readonly error = signal<string | null>(null);
  readonly statusFilter = signal<'all' | 'active' | 'completed'>('all');
  readonly priorityFilter = signal<'all' | Priority>('all');

  readonly filteredTodos = computed(() => {
    let items = this.todos();
    const status = this.statusFilter();
    const priority = this.priorityFilter();
    if (status === 'active') items = items.filter(t => !t.completed);
    if (status === 'completed') items = items.filter(t => t.completed);
    if (priority !== 'all') items = items.filter(t => t.priority === priority);
    return items;
  });

  readonly groupedTodos = computed((): DateGroup[] => {
    const map = new Map<string, DateGroup>();
    for (const todo of this.filteredTodos()) {
      const key = todo.dueDate ?? 'no-date';
      if (!map.has(key)) map.set(key, { date: key, incomplete: [], complete: [] });
      const group = map.get(key)!;
      todo.completed ? group.complete.push(todo) : group.incomplete.push(todo);
    }
    const byPriority = (a: TodoResponse, b: TodoResponse) =>
      PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    for (const group of map.values()) {
      group.incomplete.sort(byPriority);
      group.complete.sort(byPriority);
    }
    return Array.from(map.values()).sort((a, b) => {
      if (a.date === 'no-date') return 1;
      if (b.date === 'no-date') return -1;
      return a.date.localeCompare(b.date);
    });
  });

  ngOnInit(): void {
    this.todoService.getAll().subscribe({
      next: todos => this.todos.set(todos),
      error: () => this.error.set('Failed to load todos. Please try again.')
    });
  }

  openCreate(): void {
    this.editingTodo.set(null);
    this.showForm.set(true);
  }

  openEdit(todo: TodoResponse): void {
    this.editingTodo.set(todo);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingTodo.set(null);
  }

  onSave(request: TodoRequest): void {
    const editing = this.editingTodo();
    if (editing) {
      this.todoService.update(editing.id, request).subscribe({
        next: updated => {
          this.todos.update(list => list.map(t => t.id === updated.id ? updated : t));
          this.closeForm();
        },
        error: () => this.error.set('Failed to update todo.')
      });
    } else {
      this.todoService.create(request).subscribe({
        next: created => {
          this.todos.update(list => [...list, created]);
          this.closeForm();
        },
        error: () => this.error.set('Failed to create todo.')
      });
    }
  }

  onToggle(id: number): void {
    this.todoService.toggle(id).subscribe({
      next: updated =>
        this.todos.update(list => list.map(t => t.id === updated.id ? updated : t)),
      error: () => this.error.set('Failed to update status.')
    });
  }

  onDelete(id: number): void {
    if (!window.confirm('Delete this todo?')) return;
    this.todoService.delete(id).subscribe({
      next: () => this.todos.update(list => list.filter(t => t.id !== id)),
      error: () => this.error.set('Failed to delete todo.')
    });
  }

  setStatusFilter(value: 'all' | 'active' | 'completed'): void {
    this.statusFilter.set(value);
  }

  setPriorityFilter(value: 'all' | Priority): void {
    this.priorityFilter.set(value);
  }

  readonly statusOptions: { value: 'all' | 'active' | 'completed'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Done' }
  ];

  readonly priorityOptions: { value: 'all' | Priority; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' }
  ];

  formatDate(date: string): string {
    if (date === 'no-date') return 'No due date';
    return new Date(date + 'T00:00:00').toLocaleDateString('en-ZA', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }
}
