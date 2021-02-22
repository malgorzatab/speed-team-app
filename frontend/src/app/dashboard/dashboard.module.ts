import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import {MaterialModule} from '../shared/material.module';
import {MyTasksModule} from '../my-tasks/my-tasks.module';
import {SprintBoardModule} from '../sprint-board/sprint-board.module';
import {ProductMngModule} from '../product-mng/product-mng.module';
import {RetroModule} from '../retro/retro.module';
import {MyTeamModule} from '../my-team/my-team.module';
import {ProjectModule} from '../project/project.module';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import {SprintBoardComponent} from "../sprint-board/sprint-board/sprint-board.component";
import {ProductMngComponent} from "../product-mng/product-mng/product-mng.component";

@NgModule({
  declarations: [DashboardComponent, MainContentComponent, ToolbarComponent, SideNavComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MyTasksModule,
    SprintBoardModule,
    ProductMngModule,
    RetroModule,
    MyTeamModule,
    ProjectModule,
    MaterialModule
  ],
  exports: [ToolbarComponent],
  providers: [SprintBoardComponent, ProductMngComponent]
})
export class DashboardModule { }
