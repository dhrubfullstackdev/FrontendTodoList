import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodolistService {
  private apiUrl = 'https://trial-3v1m.onrender.com/api/'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  // Add a task
  addTask(task: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'Task', task);
  }

  // Get all tasks
  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'Task');
  }

  // Update a task
  updateTask(task: any): Observable<any> {
    return this.http.put<any>(this.apiUrl + 'Task', task);
  }

  // Delete a task
  deleteTask(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl + 'Task/' + id);
  }
}
