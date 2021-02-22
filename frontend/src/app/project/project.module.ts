import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectListingComponent } from './project-listing/project-listing.component';
import { ProjectFormComponent } from './project-form/project-form.component';
import {MaterialModule} from '../shared/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";
import {ProjectService} from "./services/project.service";
import {UserService} from "../user/services/user.service";

@NgModule({
  declarations: [ProjectListingComponent, ProjectFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  exports: [ProjectListingComponent, ProjectFormComponent],
  providers: [ProjectService, UserService],

})
export class ProjectModule { }
