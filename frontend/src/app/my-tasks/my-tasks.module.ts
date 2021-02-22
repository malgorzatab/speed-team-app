import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MyTasksListingComponent} from './my-tasks-listing/my-tasks-listing.component';
import {MaterialModule} from '../shared/material.module';
import {HttpClientModule} from "@angular/common/http";
import {MyTaskService} from "./services/my-task.service";
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [MyTasksListingComponent, TaskDialogComponent],
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  exports: [MyTasksListingComponent],
  providers: [MyTaskService],
  entryComponents: [TaskDialogComponent]
})
export class MyTasksModule { }
