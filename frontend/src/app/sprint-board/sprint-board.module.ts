import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprintBoardComponent } from './sprint-board/sprint-board.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../shared/material.module';
import {ToolbarComponent} from "../dashboard/components/toolbar/toolbar.component";

@NgModule({
  declarations: [SprintBoardComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
      ],
  exports: [SprintBoardComponent],

})
export class SprintBoardModule { }
