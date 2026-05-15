import { Component, input, output } from '@angular/core';
import { TodoResponse } from '../../models/todo-response.model';

@Component({
  selector: 'app-trash-item',
  templateUrl: './trash-item.component.html'
})
export class TrashItemComponent {
  readonly todo = input.required<TodoResponse>();
  readonly restoreRequested = output<number>();

  priorityBadgeClasses(): string {
    switch (this.todo().priority) {
      case 'HIGH':   return 'bg-red-100 text-red-700';
      case 'LOW':    return 'bg-green-100 text-green-700';
      default:       return 'bg-amber-100 text-amber-700';
    }
  }

  formatDeletedAt(): string {
    const d = this.todo().deletedAt;
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-ZA', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }
}
