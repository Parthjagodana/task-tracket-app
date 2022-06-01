import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TaskResponse } from './_helpers/task-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient,) { }
  baseUrl = environment.serverUrl;

  // Create New Task API
  createTask(task: any) {
    return this.http.post<TaskResponse>(this.baseUrl + '/create_task', 
    { title: task.task_title })
    .pipe(map(res => {
        return res
      })
    );
  };

  // Get All Task List
  fetchTaskData() {
    return this.http.get<TaskResponse>(this.baseUrl + '/task_list')
    .pipe(map(resData => {
      return resData
    }));
  };

  // Delete Task API Call
  deleteTask(id:any) {
    return this.http.get<TaskResponse>(this.baseUrl + '/task_delete?id=' + id)
    .pipe(map(res => {
      return res
    }));
  };

  // Update Task API Call
  updateTask(id:any, time:any, status:boolean) {
    return this.http.get(this.baseUrl + '/task_update?id=' + id + '&time=' + time + '&status=' + status)
    .pipe(map(res => {
      return res
    }));
  }
}
