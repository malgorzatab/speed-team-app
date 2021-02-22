import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductMngComponent } from './product-mng/product-mng.component';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '../shared/material.module';
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [ProductMngComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    RouterModule
  ],
  exports: [ProductMngComponent]
})
export class ProductMngModule { }
