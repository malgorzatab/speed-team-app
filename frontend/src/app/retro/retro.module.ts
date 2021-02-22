import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RetroComponent } from './retro/retro.component';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '../shared/material.module';

@NgModule({
  declarations: [RetroComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  exports: [RetroComponent]
})
export class RetroModule { }
