import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MyTaskService} from "../services/my-task.service";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatPaginator,
  MatSnackBar, MatSort,
  MatTableDataSource
} from "@angular/material";
import {Task} from "../models/task";
import { map, filter, switchMap } from 'rxjs/operators';
import {TaskDialogComponent} from "../task-dialog/task-dialog.component";
import {remove} from 'lodash';
import {ProjectService} from "../../project/services/project.service";
import {Project} from "../../project/models/project";

@Component({
  selector: 'app-my-tasks-listing',
  templateUrl: './my-tasks-listing.component.html',
  styleUrls: ['./my-tasks-listing.component.scss']
})
export class MyTasksListingComponent implements OnInit {

  displayedColumns = ['name', 'storyPoint', 'state', 'action'];
  //dataSource = new MatTableDataSource<Task>();
  dataSource: Task[] = [];
  resultsLength = 0;
  tempProject: Project;
  projectToSave: Project;
  tempTask: Task;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private myTaskService: MyTaskService, public dialog: MatDialog, private snackBar: MatSnackBar, private projectService: ProjectService) { }

  ngOnInit() {
    this.paginator
      .page
      .subscribe(data => {
      this.myTaskService
        .getTasks({page: ++data.pageIndex, perPage: data.pageSize})
        .subscribe(data => {
          console.log(data);
          this.dataSource = data.docs;
          this.resultsLength = data.total;
        });
    }, err => this.errorHandler(err, 'Failed to fetch tasks'));
   this.populateMyTasks();
  }

  private populateMyTasks(){
    this.myTaskService.getTasks({page: 1, perPage: 10})
      .subscribe(data => {
        console.log(data);
        this.dataSource = data.docs;
        this.resultsLength = data.total;
      }, err => this.errorHandler(err, 'Failed to fetch tasks'));
  }

  newTaskBtn(){
  }

  deleteTaskBtn(id){
    this.myTaskService.deleteTask(id)
      .subscribe(data => {
        const removeItems = remove(this.dataSource,(task) => {
          return task._id === data._id
        });
        this.dataSource = [...this.dataSource];
        this.snackBar.open('Task deleted', 'Success', {
          duration: 2000
        })
      }, err => this.errorHandler(err, 'Failed to delete task'));
  }

  openDialog(taskId: string): void {
    const options = {
      width: '450px',
      height: '550px',
      data: {}
    };

    if(taskId){
      options.data = {taskId: taskId}
    }
    const dialogRef = this.dialog.open(TaskDialogComponent, options);


    dialogRef.afterClosed()
      .pipe(filter(clientParam => typeof clientParam === 'object'))
      .subscribe(result => {
        //if taskId - edit
        if(taskId){
          this.myTaskService.updateTask(taskId, result)
            .subscribe(data => {
              console.log(data);
              const index = this.dataSource.findIndex(task => task._id === taskId);
              this.dataSource[index] = data;
              this.dataSource = [...this.dataSource];

              //update Project
              this.projectService.getProject(data.project)
                .subscribe(project => {
                  if(data.state == 'To do'){
                    const idx = project.toDoTasks.findIndex(d => d._id == data._id);
                    project[idx] = data;
                  } else if (data.state == 'In progress') {
                    const idx = project.inProgressTasks.findIndex(d => d._id == data._id);
                    project.inProgressTasks[idx] = data;
                  } else if (data.state == 'Done'){
                    const idx = project.doneTasks.findIndex(d => d._id == data._id);
                    project.doneTasks[idx] = data;
                  }
                  this.projectToSave = new Project(project.code, project.name, project.description, project.dueDate, project.members, project.toDoTasks, project.inProgressTasks, project.doneTasks, project.backlog);
                  this.projectService.updateProject(data.project, this.projectToSave)
                    .subscribe(data => {
                      console.log(data);
                    },err => this.errorHandler(err, 'Failed to update project'));
                },err => this.errorHandler(err, 'Failed to get project'));


              this.snackBar.open('Updated task!', 'Success', {duration: 2000});
            }, err => this.errorHandler(err, 'Failed to update task'));
        } else {
          this.myTaskService.createTask(result)
            .subscribe(data => {
              console.log(data);
              this.dataSource.push(data);
              this.dataSource = [...this.dataSource];

              //add Tasks to project
              //update Project
              this.projectService.getProject(data.project)
                .subscribe(project => {
                  if(data.state == 'To do'){
                    project.toDoTasks.push(data);
                  } else if (data.state == 'In progress') {
                    project.inProgressTasks.push(data);
                  } else if (data.state == 'Done'){
                    project.doneTasks.push(data);
                  }
                  this.projectToSave = new Project(project.code, project.name, project.description, project.dueDate, project.members, project.toDoTasks, project.inProgressTasks, project.doneTasks, project.backlog);
                  this.projectService.updateProject(data.project, this.projectToSave)
                    .subscribe(data => {
                      console.log(data);
                    },err => this.errorHandler(err, 'Failed to update project'));
                },err => this.errorHandler(err, 'Failed to get project'));


              this.snackBar.open('Created task!', 'Success', {duration: 2000});
            }, err => this.errorHandler(err, 'Failed to create task'));
        }

    })
  }

  private errorHandler(error, message) {
    console.log(error);
    this.snackBar.open(message, 'Error', {
      duration: 2000
    });
  }


}

