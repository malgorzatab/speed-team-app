import { Component, OnInit } from '@angular/core';
import {Project} from "../../project/models/project";
import {ProjectService} from "../../project/services/project.service";
import {Router} from "@angular/router";
import {MatDialog, MatSnackBar} from "@angular/material";
import {GlobalsService} from "../../../globals/globals";
import {User} from "../../user/models/user";
import {UserService} from "../../user/services/user.service";
import {remove} from 'lodash';
import {Task} from 'src/app/my-tasks/models/task';
import {TaskDialogComponent} from "../../my-tasks/task-dialog/task-dialog.component";
import {filter} from "rxjs/operators";
import {MyTaskService} from "../../my-tasks/services/my-task.service";

@Component({
  selector: 'app-product-mng',
  templateUrl: './product-mng.component.html',
  styleUrls: ['./product-mng.component.scss']
})
export class ProductMngComponent implements OnInit {

  projectName;
  due;
  members: User[] =[];
  membersNames = [];
  users: User[] = [];
  projects: Project[] = [];
  desc;
  code;
  backlog: Task[] = [];
  taskInBacklog: Task;
  project: Project;
  projectId;
  tasks: Task[] =[];
  projectToSave: Project;
  taskToSend: Task;
  newTaskToSend: Task;
  newMember: User;
  backlogTasks: Task[] = [];
  backlogTaskNames = [];
  membId: string;
  projId: string;

  constructor(private projectService: ProjectService,
              public snackBar: MatSnackBar,
              private globalService: GlobalsService,
              private userService: UserService,
              private router: Router,
              private myTaskService: MyTaskService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.membersNames = [];
    this.users = [];
    this.members = [];
    this.desc = '';
    this.due = '';
    this.code = '';
    this.backlog = [];
    this.backlogTaskNames = [];
    this.globalService.currentId.subscribe(message => this.projectId = message);
    this.setProjects();
    this.populateMyTasks();
    this.setProject(this.projectId);
  }

  private setMembers(){
    this.userService.getUsers()
      .subscribe(users => {
        this.users = users;
        for(let i=0; i<users.length; i++){
          this.membersNames.push(users[i].username);
        }
        console.log(users);
      },err => this.errorHandler(err, 'Failed to get users'))
  }


  private setProjects(){
    this.projectService.getProjects({
      page: 0,
      perPage: 20,
      sortField: '',
      sortDir: '',
      filter: ''
    })
      .subscribe(data => {
        this.projects = data.docs;
        console.log(data);
      },err => this.errorHandler(err, 'Failed to get projects'))
  }

  private setTasks(){

  }

  private selectedProject(event){
    this.membersNames = [];
    this.users = [];
    this.members = [];
    this.desc = '';
    this.due = '';
    this.code = '';
    this.backlog = [];
    this.backlogTaskNames = [];
    let target = event.source.selected._element.nativeElement;
    let selectedData = {
      value: event.value,
      text: target.innerText.trim()
    };
    this.projectId = event.value;
    this.setProject(this.projectId);
  }


  public setProject(id){
    //debugger;
    this.projectService.getProject(id)
      .subscribe(data => {
        console.log(data);
        this.project = data;
        this.projectName = data.name;
        this.code = data.code;
        this.due = data.dueDate;
        this.desc = data.description;
        this.members = data.members;
        this.backlog = data.backlog;

        this.setMembers();
        this.setBacklog(this.backlog);
        console.log(this.backlog)
      }, err => this.errorHandler(err, 'Failed to get projects'));
  }

  private setBacklog(backlog: Task[]){
    for(let i=0; i<backlog.length; i++){
      this.taskInBacklog = this.tasks.find(t => t._id == backlog[i]._id);
      this.backlogTaskNames.push(this.taskInBacklog.name);
    }

  }

  private populateMyTasks(){
    this.myTaskService.getTasks({page: 1, perPage: 100})
      .subscribe(data => {
        console.log(data);
        this.tasks = data.docs;
        //this.resultsLength = data.total;
      }, err => this.errorHandler(err, 'Failed to fetch tasks'));
  }

  editProjectBtn(id){
    this.router.navigate(['dashboard', 'project', id]);
  }

  deleteProjectBtn(id){
    this.projectService.deleteProject(id)
      .subscribe(data => {
        const removeItems = remove(this.projects,(project) => {
          return project._id === data._id
        });
        //this.dataSource = [...this.dataSource];
        this.snackBar.open('Project deleted', 'Success', {
          duration: 2000
        })
      }, err => this.errorHandler(err, 'Failed to delete project'));
  }




  //add tasks to backlog - create new Task

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
              const index = this.tasks.findIndex(task => task._id === taskId);
              this.tasks[index] = data;
              this.tasks = [...this.tasks];
              this.backlogTaskNames.push(data.name);
              this.backlogTaskNames = [...this.backlogTaskNames];

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
              this.tasks.push(data);
              this.tasks = [...this.tasks];
              this.backlogTaskNames.push(data.name);
              this.backlogTaskNames = [...this.backlogTaskNames];

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
                  } else if(data.state == 'Backlog'){
                    project.backlog.push(data);
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

   private addToTODO(taskName: string){
    console.log(taskName);
    this.taskToSend = this.tasks.find(t => t.name == taskName);
    console.log(this.taskToSend);
    this.taskToSend.state = 'To do';
     console.log(this.taskToSend);
     const idx = this.backlogTaskNames.findIndex(n => n == taskName);
     this.backlogTaskNames.splice(idx, 1);
     this.backlogTaskNames = [...this.backlogTaskNames];
     //get task and update id
     this.myTaskService.getTask(this.taskToSend._id)
       .subscribe(data =>{
         this.membId = data.member;
         this.projId = data.project;
         this.newTaskToSend = new Task(this.taskToSend.name, this.membId, this.taskToSend.state, this.taskToSend.storyPoint, this.projId);
         this.myTaskService.updateTask(this.taskToSend._id, this.newTaskToSend)
           .subscribe(dataT => {
             const removeItems = remove(this.tasks,(task) => {
               return task._id === dataT._id;
             });
             this.tasks = [...this.tasks];
             //update project
             this.projectService.getProject(dataT.project)
               .subscribe(project => {
                 const idx = project.backlog.findIndex(d => d._id == dataT._id);
                 project.backlog.splice(idx, 1);
                 project.toDoTasks.push(dataT);
                 this.projectToSave = new Project(project.code, project.name, project.description, project.dueDate, project.members, project.toDoTasks, project.inProgressTasks, project.doneTasks, project.backlog);
                 this.projectService.updateProject(dataT.project, this.projectToSave)
                   .subscribe(data => {
                     console.log(data);
                   },err => this.errorHandler(err, 'Failed to update project'));
               },err => this.errorHandler(err, 'Failed to get project'));
             //end of updating project

             this.snackBar.open('Task moved to "To do', 'Success', {
               duration: 2000
             })
           },err => this.errorHandler(err, 'Failed to move task to "To do"'))
       });
   }

   private deleteBacklogTask(taskName: string){
     const idx = this.backlogTaskNames.findIndex(n => n == taskName);
     this.backlogTaskNames.splice(idx, 1);
     this.backlogTaskNames = [...this.backlogTaskNames];
     this.taskToSend = this.tasks.find(t => t.name == taskName);
       this.myTaskService.deleteTask(this.taskToSend._id)
         .subscribe(data => {
           const removeItems = remove(this.tasks,(task) => {

             //update Project backlog
             this.projectService.getProject(data.project)
               .subscribe(project => {
                 const idx = project.backlog.findIndex(d => d._id == data._id);
                 project.backlog.splice(idx, 1);
                 this.projectToSave = new Project(project.code, project.name, project.description, project.dueDate, project.members, project.toDoTasks, project.inProgressTasks, project.doneTasks, project.backlog);
                 this.projectService.updateProject(data.project, this.projectToSave)
                   .subscribe(data => {
                     console.log(data);
                   },err => this.errorHandler(err, 'Failed to update project'));
               },err => this.errorHandler(err, 'Failed to get project'));
             //end of updating project

             return task._id === data._id
           });
           this.tasks = [...this.tasks];
           this.snackBar.open('Task deleted', 'Success', {
             duration: 2000
           })
         }, err => this.errorHandler(err, 'Failed to delete task'));
     }


  private errorHandler(error, message) {
    console.log(error);
    this.snackBar.open(message, 'Error', {
      duration: 2000
    });
  }

}
