import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProjectService} from "../services/project.service";
import {MatSnackBar} from "@angular/material";
import {ActivatedRoute, Router} from "@angular/router";
import {Project} from "../models/project";
import {UserService} from "../../user/services/user.service";
import {User} from "../../user/models/user";

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit {

  projectForm: FormGroup;
  private project: Project;
  users: User[] = [];

  constructor(private  fb: FormBuilder,
              private projectService: ProjectService,
              public snackBar: MatSnackBar,
              private router: Router,
              private route: ActivatedRoute,
              private userService: UserService) { }

  ngOnInit() {
    this.createForm();
    this.setProjectToForm();
    this.setMembers();
  }

  onCancel(){
    this.router.navigate(['dashboard', 'project']);
  }

  onSubmit(){
    //user wants to edit the project
    if(this.project){
      this.projectService
        .updateProject(this.project._id, this.projectForm.value)
        .subscribe(data => {
          this.snackBar.open('Project updated', 'Success',{
            duration: 2000
          });
          this.router.navigate(['dashboard', 'project']);
        }, err => this.errorHandler(err, 'Failed to update project')
          )
    } else {
      this.projectService.createProject(this.projectForm.value)
        .subscribe(data => {
            this.snackBar.open('Project created!', 'Success', {
              duration: 2000,
            });
            this.projectForm.reset();
            this.router.navigate(['dashboard', 'project']);
            console.log(data);
          },
          err => this.errorHandler(err, 'Failed to create project')
        );
    }
  }

  private setMembers(){
    this.userService.getUsers()
      .subscribe(users => {
        this.users = users;
      },err => this.errorHandler(err, 'Failed to get users'))
  }

    private createForm(){
      this.projectForm = this.fb.group({
        name: ['', Validators.required],
        code: ['', Validators.required],
        description: ['', Validators.required],
        dueDate: ['', Validators.required],
        members: '',
        // backlog:'',
      })
  }

  private setProjectToForm(){
    this.route.params
      .subscribe(params => {
        let id = params['id'];
        if(!id){
          return;
        }
        this.projectService.getProject(id)
          .subscribe(project => {
            this.project = project;
            this.projectForm.patchValue(this.project);
          }, err => this.errorHandler(err, 'Failed to get project')
            )
      });
  }

  private errorHandler(error, message){
    console.error(error);
    this.snackBar.open(message, 'Error', {
      duration: 2000
    });
  }

}
