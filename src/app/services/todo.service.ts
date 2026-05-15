import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TodoRequest } from '../models/todo-request.model';
import { TodoResponse } from '../models/todo-response.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'api/todo';

  getAll(): Observable<TodoResponse[]> {
    return this.http.get<TodoResponse[]>(this.apiUrl);
  }

  create(request: TodoRequest): Observable<TodoResponse> {
    return this.http.post<TodoResponse>(this.apiUrl, request);
  }

  update(id: number, request: TodoRequest): Observable<TodoResponse> {
    return this.http.put<TodoResponse>(`${this.apiUrl}/${id}`, request);
  }

  toggle(id: number): Observable<TodoResponse> {
    return this.http.patch<TodoResponse>(`${this.apiUrl}/${id}/toggle`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getDeleted(): Observable<TodoResponse[]> {
    return this.http.get<TodoResponse[]>(`${this.apiUrl}/deleted`);
  }

  restore(id: number): Observable<TodoResponse> {
    return this.http.patch<TodoResponse>(`${this.apiUrl}/${id}/restore`, {});
  }
}
