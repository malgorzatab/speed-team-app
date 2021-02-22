import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {MatDialog, MatSnackBar} from "@angular/material";
import {ProjectService} from "../../project/services/project.service";
import {Project} from "../../project/models/project";
import {Task} from 'src/app/my-tasks/models/task';
import {MyTaskService} from "../../my-tasks/services/my-task.service";
import {UserService} from "../../user/services/user.service";
import {User} from "../../user/models/user";
import {remove} from 'lodash';
import {TaskDialogComponent} from "../../my-tasks/task-dialog/task-dialog.component";
import {filter} from "rxjs/operators";
import {GlobalsService} from '../../../globals/globals';
import {ToolbarComponent} from "../../dashboard/components/toolbar/toolbar.component";

@Component({
  selector: 'app-sprint-board',
  templateUrl: './sprint-board.component.html',
  styleUrls: ['./sprint-board.component.scss']
})
export class SprintBoardComponent implements OnInit {

  projects: Project[] =[];    //all projects from database
  project: Project;           //one project from database
  @Input() project_id = '';
  tasks: Task[] = [];
  clickedTask: Task;
  todo = [];
  toDoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[]= [];
  backlog: Task[] =[];
  inProgress = [];
  done = [];
  taskName;
  storyPoint;
  taskMember;
  taskMemberName;
  memberId;
  taskState;
  selectedTaskId;
  users: User[] = [];
  projectToSave: Project;
  taskToUpdate: Task;
  userinTask: User;
  removedTask: Task;
  selectedTask: Task;


  constructor(private snackBar: MatSnackBar,
              private projectService: ProjectService,
              private taskService: MyTaskService,
              private userService: UserService,
              public dialog: MatDialog,
              private globalService: GlobalsService,
             ) { }

  ngOnInit() {
    this.setProjects();
    this.setMembers();
    this.taskMemberName = '';
    this.taskName = '';
    this.storyPoint = '';
    this.taskState = '';

    this.selectedTaskId = '';

    this.tasks = [];
    this.toDoTasks = [];
    this.inProgressTasks = [];
    this.doneTasks = [];
    this.projects = null;
    //this.project_id = this.globals.project_id;
    this.globalService.currentId.subscribe(message => this.project_id = message);
    this.setProject(this.project_id);
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

  selectedProject(event) {
    this.taskMemberName = '';
    this.taskName = '';
    this.storyPoint = '';
    this.taskState = '';

    this.selectedTaskId = '';

    this.tasks = [];
    this.toDoTasks = [];
    this.inProgressTasks = [];
    this.doneTasks = [];
    let target = event.source.selected._element.nativeElement;
    let selectedData = {
     value: event.value,
     text: target.innerText.trim()
    };
   this.project_id = event.value;
    this.setProject(this.project_id);
    //console.log(selectedData);
  }

  private setMembers(){
    this.userService.getUsers()
      .subscribe(users => {
        this.users = users;
        console.log(users);
      },err => this.errorHandler(err, 'Failed to get users'))
  }

  public setProject(project_id){
   //this.project_id = project_id;
    this.projectService.getProject(project_id).subscribe(data => {
      this.project = data;
      console.log(this.project);
      this.toDoTasks = this.project.toDoTasks;
      this.inProgressTasks = this.project.inProgressTasks;
      this.doneTasks = this.project.doneTasks;
      for(let i=0; i<this.project.toDoTasks.length; i++){
        this.tasks.push(this.project.toDoTasks[i]);
      }
      for(let i=0; i<this.project.inProgressTasks.length; i++){
        this.tasks.push(this.project.inProgressTasks[i]);
      }
      for(let i=0; i<this.project.doneTasks.length; i++){
        this.tasks.push(this.project.doneTasks[i]);
      }

    }, err => this.errorHandler(err, 'Failed to get projects'));
    console.log("PROJECTS");
    console.log(this.tasks);
  }

  showTaskDetails(taskId){
    this.clickedTask = this.tasks.find(p => p._id == taskId);
    console.log(this.clickedTask);
    this.memberId = this.clickedTask.member;
    this.taskMember = this.users.find(u => u._id == this.memberId);
    console.log(this.taskMember);
    if(this.taskMember !== undefined ){
      this.taskMemberName = this.taskMember.username;
    } else {
      this.taskMemberName = 'Edit to add member + ';
    }
    this.taskName = this.clickedTask.name;
    this.storyPoint = this.clickedTask.storyPoint;
    this.taskState = this.clickedTask.state;
    this.selectedTaskId = taskId;
  }

  private errorHandler(error, message) {
    console.log(error);
    this.snackBar.open(message, 'Error', {
      duration: 2000
    });
  }

  deleteTaskBtn(id){
    const index = this.tasks.findIndex(task => task._id == id);
    this.removedTask = this.tasks[index];
    if(this.removedTask.state == 'To do'){
      const idx = this.toDoTasks.findIndex(task => task._id == id);
      this.toDoTasks.splice(idx,1);
    } else if(this.removedTask.state == 'In progress'){
      const idx = this.inProgressTasks.findIndex(task => task._id == id);
      this.inProgressTasks.splice(idx,1);
    } else if(this.removedTask.state == 'Done'){
      const idx = this.doneTasks.findIndex(task => task._id == id);
      this.doneTasks.splice(idx,1);
    }

    this.taskService.deleteTask(id)
      .subscribe(data => {
        const removeItems = remove(this.tasks,(task) => {
          return task._id === data._id;
        });
        this.tasks = [...this.tasks];

        this.snackBar.open('Task deleted', 'Success', {
          duration: 2000
        });

        this.taskMemberName = '';
        this.taskName = '';
        this.storyPoint = '';
        this.taskState = '';
        this.selectedTaskId = '';

      }, err => this.errorHandler(err, 'Failed to delete task'));
  }

  openDialog(taskId: string): void {
    const options = {
      width: '450px',
      height: '550px',
      data: {}
    };
    console.log(taskId);
    if(taskId){
      options.data = {taskId: taskId}
    }
    const dialogRef = this.dialog.open(TaskDialogComponent, options);

    dialogRef.afterClosed()
      .pipe(filter(clientParam => typeof clientParam === 'object'))
      .subscribe(result => {
        //if taskId - edit
        if(taskId){
          this.taskService.updateTask(taskId, result)
            .subscribe(data => {
              console.log(data);
              if(data.state == 'To do'){
                const index = this.toDoTasks.findIndex(task => task._id === taskId);
                this.toDoTasks[index] = data;
                this.toDoTasks = [...this.toDoTasks];
              } else if (data.state == 'In progress') {
                const index = this.inProgressTasks.findIndex(task => task._id === taskId);
                this.inProgressTasks[index] = data;
                this.inProgressTasks = [...this.inProgressTasks];
              } else if (data.state == 'Done'){
                const index = this.doneTasks.findIndex(task => task._id === taskId);
                this.doneTasks[index] = data;
                this.doneTasks = [...this.doneTasks];
              }
              const ind = this.tasks.findIndex(task => task._id === taskId);
              this.tasks[ind] = data;
              this.tasks = [...this.tasks];
              this.showTaskDetails(data._id);
              this.snackBar.open('Updated task!', 'Success', {duration: 2000});

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

            }, err => this.errorHandler(err, 'Failed to update task'));
        } else {
          this.taskService.createTask(result)
            .subscribe(data => {
              console.log(data);
              debugger;
              if(data.state == 'To do'){
                this.toDoTasks.push(data);
                this.toDoTasks = [...this.toDoTasks];
              } else if (data.state == 'In progress') {
                this.inProgressTasks.push(data);
                this.inProgressTasks = [...this.inProgressTasks];
              } else if (data.state == 'Done'){
                this.doneTasks.push(data);
                this.doneTasks = [...this.doneTasks];
              }
              this.tasks.push(data);
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
              debugger;
            }, err => this.errorHandler(err, 'Failed to create task'));
        }

      })
  }


  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      console.log(event);
      console.log(event.container.id);
      console.log(event.item);
      let draggedElemId = event.item.element.nativeElement.id;
      this.updateTaskState(draggedElemId, event.container.id);

    }
  }

  private updateTaskState(taskId, newState){
  console.log(typeof taskId);
    this.taskService.getTask(taskId)
      .subscribe(task =>{
        console.log(task);
        this.userinTask = new User();
        let id = task.member;
        this.taskToUpdate = new Task(task.name, id, newState, task.storyPoint, task.project);
        //update task
        this.taskService.updateTask(taskId, this.taskToUpdate)
          .subscribe( data => {     //data --> task after update
            console.log(data);
            //update project
            this.projectService.getProject(data.project)
              .subscribe(project => {
                if(task.state == 'To do'){
                  const idx = project.toDoTasks.findIndex(d => d._id == data._id);
                  project.toDoTasks.splice(idx, 1);
                } else if (task.state == 'In progress') {
                  const idx = project.inProgressTasks.findIndex(d => d._id == data._id);
                  project.inProgressTasks.splice(idx,1);
                } else if (task.state == 'Done'){
                  const idx = project.doneTasks.findIndex(d => d._id == data._id);
                  project.doneTasks.splice(idx, 1);
                }
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
          }, err => this.errorHandler(err, 'Failed to update task'))
      }, err => this.errorHandler(err, 'Failed to get task'))
  }

}
