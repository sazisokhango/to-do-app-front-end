import { Component, input, output } from '@angular/core';
import { TodoResponse } from '../../models/todo-response.model';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html'
})
export class TodoItemComponent {
  readonly todo = input.required<TodoResponse>();
  readonly toggled = output<number>();
  readonly editRequested = output<TodoResponse>();
  readonly deleteRequested = output<number>();

  priorityClasses(): string {
    switch (this.todo().priority) {
      case 'HIGH':   return 'border-red-400 bg-red-50';
      case 'LOW':    return 'border-green-400 bg-green-50';
      default:       return 'border-amber-400 bg-amber-50';
    }
  }

  priorityBadgeClasses(): string {
    switch (this.todo().priority) {
      case 'HIGH':   return 'bg-red-100 text-red-700';
      case 'LOW':    return 'bg-green-100 text-green-700';
      default:       return 'bg-amber-100 text-amber-700';
    }
  }

  isOverdue(): boolean {
    if (this.todo().completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(this.todo().dueDate) < today;
  }
}
