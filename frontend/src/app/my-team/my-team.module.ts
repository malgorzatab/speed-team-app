import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyTeamComponent } from './my-team/my-team.component';
import {MaterialModule} from '../shared/material.module';

@NgModule({
  declarations: [MyTeamComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [MyTeamComponent]
})
export class MyTeamModule { }
