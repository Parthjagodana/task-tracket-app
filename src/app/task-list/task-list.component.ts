import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  public createTaskForm: FormGroup;
  public submitted: boolean = false;
  public error: any;
  public tasks: any;
  start: boolean = false;
  timer: any;
  seconds: number = 0;
  currentTimeTracked = this.timeTrackedFormatter(this.seconds);
  startTime: any;
  task_id: any;
  @ViewChild('closebutton') closebutton: any;

  constructor(private Formbuild: FormBuilder, private appservice: AppService, private toastr: ToastrService) {
    this.createTaskForm = this.Formbuild.group({
      task_title: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllTask();
  }


  // Create New Task
  onTaskCreate() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.createTaskForm.invalid) {
      this.toastr.warning("Please Enter Input Value", 'Warning!', {
        closeButton: true
      });
      return;
    }

    this.appservice.createTask(this.createTaskForm.value).subscribe(res => {
      let data = {
        _id: res.data?._id,
        title: res.data?.title,
        total_time: res.data?.total_time,
        is_status: res.data?.is_status,
      }
      this.tasks.push(data);

      this.closebutton.nativeElement.click();
      this.createTaskForm.reset();
      this.toastr.success(res.message, 'Success!', {
        closeButton: true
      });
    },
      err => {
        this.error = err.error.message
        this.toastr.error(err.error.message, 'Error!', {
          closeButton: true
        });
      });
  };

  // Get All Task
  getAllTask() {
    this.appservice.fetchTaskData().subscribe(res => {
      this.tasks = res.data;
    });
  };

  // Delete Task
  deleteTask(id: any) {
    this.appservice.deleteTask(id).subscribe(res => {
      for (var i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i]._id === id) {
          this.tasks.splice(i, 1);
          this.toastr.success('Task Removed Successfully!', 'Removed!', {
            closeButton: true
          });
        };
      };
    });
  };

  // Update Task
  updateTask(id: any, time: any, status: boolean) {
    this.appservice.updateTask(id, time, status).subscribe(res => {
    });
  };


  // Timer Function Start
  timerStart(id: any) {
    for (let i = 0; i < this.tasks.length; i++) {
      const element = this.tasks[i];
      if(element.is_status === true) {
        this.toastr.warning('One Task Complete and befor Start Next Task!', 'Alert!', {
          closeButton: true
        });
        return
      }
    }
    this.start = true;
    this.task_id = id;
    this.seconds = 0;

    for (let i = 0; i < this.tasks.length; i++) {
      const element = this.tasks[i];
      if (element.total_time != undefined) {
        var a = element?.total_time?.split(':'); // split it at the colons
        if (element._id === id) {
          this.seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
        };
      };
    };

    this.timer = setInterval(() => {
      this.seconds++;
      this.currentTimeTracked = this.timeTrackedFormatter(this.seconds);
    }, 1000);
    this.updateTask(id, this.currentTimeTracked, true);
    const obj = this.tasks.find((obj: any) => {
      return obj._id === id ? obj.is_status = true : false;
    })

    this.startTime = new Date();
  };

  timerStop(id: any) {
    clearInterval(this.timer);
    this.start = false;
    this.task_id = ''

    this.currentTimeTracked = this.timeTrackedFormatter(this.seconds);
    this.updateTask(id, this.currentTimeTracked, false);
    const obj = this.tasks.find((obj: any) => {
      return obj._id === id ? obj.total_time = this.currentTimeTracked : '';
    })
    this.tasks.find((obj: any) => {
      return obj._id === id ? obj.is_status = false : false;
    })
    
  };

  timeTrackedFormatter(seconds: any) {
    let minutes = 0;
    let hours = 0;
    while (seconds >= 3600) {
      seconds -= 3600;
      hours++;
    }
    while (seconds >= 60) {
      seconds -= 60;
      minutes++;
    }
    return ((hours < 10) ? "0" + hours : hours) + ":" + ((minutes < 10) ? "0" + minutes : minutes) + ":" + ((seconds < 10) ? "0" + seconds : seconds);
  }

}

