import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  AlertModule,
  ButtonDirective,
  ButtonModule,
  CardBodyComponent,
  CardComponent,
  CardModule,
  CollapseDirective,
  FormModule,
  GridModule,
  TableModule,
  TooltipModule,
  UtilitiesModule,
} from '@coreui/angular';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import {
  MatDatepicker,
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { TodolistService } from '../Services/todolist.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [
    ButtonDirective,
    CollapseDirective,
    CardComponent,
    CardBodyComponent,
    GridModule,
    FormModule,
    CardModule,
    TableModule,
    UtilitiesModule,
    ButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    TooltipModule,
    AlertModule,
  ],
  providers: [provideNativeDateAdapter()],
})
export class DashboardComponent implements OnInit {
  currentDate = new Date();
  visible = false;
  isEditing: boolean = false;
  changeIcon = true;
  inputValue: string = '';
  selectedDate: Date | null = null;
  tasks: any;
  currentTaskId: number | null = null;
  form: FormGroup;
  alertVisible: boolean = false;
  alertType: 'success' | 'error' = 'success';
  alertMessage: string = '';
  constructor(private fb: FormBuilder, private taskService: TodolistService) {
    this.form = this.fb.group({
      task: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.getAllTask();
  }

  onSubmit(): void {
    if (this.isEditing && this.currentTaskId !== null) {
      const updatedTask = {
        taskId: this.currentTaskId,
        description: this.form.controls['task'].value,
        title: 'Task',
        dueDate: this.selectedDate,
        isCompleted: false,
        priority: 1,
        createdDate: this.currentDate,
        userId: 6,
        categoryId: 1,
      };
      this.taskService.updateTask(updatedTask).subscribe({
        next: (response) => {
          const index = this.tasks.findIndex(
            (t: any) => t.taskId === this.currentTaskId
          );
          if (index !== -1) {
            this.tasks[index] = response;
          }

          this.showAlert('success', 'Task updated successfully.');
          this.currentTaskId = null;
        },
        error: (err) => {
          console.error('Error updating task:', err);
          this.showAlert('error', 'Something went wrong.');
        },
      });
    } else {
      var data = {
        taskId: 0,
        title: 'Task',
        description: this.form.controls['task'].value,
        dueDate: this.selectedDate,
        isCompleted: false,
        priority: 1,
        createdDate: this.currentDate,
        userId: 6,
        categoryId: 1,
      };
      this.taskService.addTask(data).subscribe({
        next: (response) => {
          this.showAlert('success', 'Task added successfully.');
          this.tasks.unshift(response);
        },
        error: (err) => {
          console.error('Error creating task:', err);
          this.showAlert('error', 'Something went wrong.');
        },
      });
    }
    this.form.reset();
  }

  getAllTask() {
    this.taskService.getTasks().subscribe({
      next: (response) => {
        this.tasks = response.filter(
          (t) =>
            t.createdDate.split('T')[0] ==
            this.currentDate.toISOString().split('T')[0]
        );
      },
      error: (err) => {
        console.error('Error creating task:', err);
      },
    });
  }
  resetForm() {
    this.inputValue = '';
    this.selectedDate = null;
  }
  changeStatus(task: any) {
    this.currentTaskId = task.taskId;
    task.isCompleted = !task.isCompleted;
    const updatedTask = {
      taskId: task.taskId,
      description: task.description,
      title: 'Task',
      dueDate: task.dueDate,
      isCompleted: task.isCompleted,
      priority: task.priority,
      createdDate: task.createdDate,
      userId: task.userId,
      categoryId: task.categoryId,
    };
    this.taskService.updateTask(updatedTask).subscribe({
      next: (response) => {
        const index = this.tasks.findIndex(
          (t: any) => t.taskId === this.currentTaskId
        );
        if (index !== -1) {
          this.tasks[index] = response;
        }
        if (task.isCompleted) {
          this.showAlert('success', 'Task marked completed.');
        } else {
          this.showAlert('success', 'Remove marked status.');
        }

        this.currentTaskId = null;
      },
      error: (err) => {
        console.error('Error updating task:', err);
        this.showAlert('error', 'Something went wrong.');
        task.isCompleted = !task.isCompleted;
      },
    });
  }
  changeImp(task: any) {
    this.currentTaskId = task.taskId;
    if (task.priority == 1) {
      task.priority = 3;
    } else {
      task.priority = 1;
    }
    const updatedTask = {
      taskId: task.taskId,
      description: task.description,
      title: 'Task',
      dueDate: task.dueDate,
      isCompleted: task.isCompleted,
      priority: task.priority,
      createdDate: task.createdDate,
      userId: task.userId,
      categoryId: task.categoryId,
    };
    this.taskService.updateTask(updatedTask).subscribe({
      next: (response) => {
        const index = this.tasks.findIndex(
          (t: any) => t.taskId === this.currentTaskId
        );
        if (index !== -1) {
          this.tasks[index] = response;
        }
        this.currentTaskId = null;
        if (task.priority == 1) {
          this.showAlert('success', 'Task marked important.');
        } else {
          this.showAlert('success', 'Task marked not important.');
        }
      },
      error: (err) => {
        console.error('Error updating task:', err);
        this.showAlert('error', 'Something went wrong.');
        task.priority = !task.priority;
      },
    });
  }
  editTask(task: any) {
    this.isEditing = true;
    this.currentTaskId = task.taskId; // Set the task ID being edited
    this.form.patchValue({ task: task.description }); // Set the task ID for editing
    if (!this.visible) {
      this.toggleCollapse(); // Open the input box if not already visible
    }
  }
  cancelEdit(): void {
    this.isEditing = false;
    this.currentTaskId = null;
    this.form.reset(); // Clear the form
    this.toggleCollapse();
  }
  toggleCollapse(): void {
    this.changeIcon = !this.changeIcon;
    this.visible = !this.visible;
  }
  onDateSelected(event: MatDatepickerInputEvent<Date>): void {
    this.selectedDate = event.value;
  }
  deleteTask(task: any) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(task.taskId).subscribe({
        next: (response) => {
          this.tasks = this.tasks.filter((t: any) => t.taskId !== task.taskId);
          this.showAlert('success', 'Task deleted successfully.');
        },
        error: (err) => {
          console.error('Error creating task:', err);
          this.showAlert('error', 'Something went wrong.');
        },
      });
    }
  }
  showAlert(type: 'success' | 'error', message: string) {
    this.alertType = type;
    this.alertMessage = message;
    this.alertVisible = true;
    setTimeout(() => {
      this.alertVisible = false;
    }, 3000);
  }
}
