import { Component, inject, input, output, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TodoResponse } from '../../models/todo-response.model';
import { TodoRequest } from '../../models/todo-request.model';
import { PRIORITIES } from '../../models/priority.enum';

function notInPast(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(control.value) < today ? { pastDate: true } : null;
}

@Component({
  selector: 'app-todo-form',
  imports: [ReactiveFormsModule],
  templateUrl: './todo-form.component.html'
})
export class TodoFormComponent implements OnInit {
  readonly todo = input<TodoResponse | null>(null);
  readonly saved = output<TodoRequest>();
  readonly cancelled = output<void>();

  readonly priorities = PRIORITIES;
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    description: [''],
    priority: ['MEDIUM'],
    dueDate: ['', [Validators.required, notInPast]]
  });

  ngOnInit(): void {
    const todo = this.todo();
    if (todo) {
      this.form.patchValue({
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        dueDate: todo.dueDate
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { title, description, priority, dueDate } = this.form.getRawValue();
    this.saved.emit({
      title: title!,
      description: description ?? '',
      priority: (priority ?? 'MEDIUM') as TodoRequest['priority'],
      dueDate: dueDate!
    });
  }

  get titleControl() { return this.form.get('title')!; }
  get dueDateControl() { return this.form.get('dueDate')!; }
}
