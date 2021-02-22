import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {MainContentComponent} from './components/main-content/main-content.component';
import {MyTasksListingComponent} from '../my-tasks/my-tasks-listing/my-tasks-listing.component';
import {SprintBoardComponent} from '../sprint-board/sprint-board/sprint-board.component';
import {ProductMngComponent} from '../product-mng/product-mng/product-mng.component';
import {RetroComponent} from '../retro/retro/retro.component';
import {MyTeamComponent} from '../my-team/my-team/my-team.component';
import {ProjectListingComponent} from '../project/project-listing/project-listing.component';
import {ProjectFormComponent} from "../project/project-form/project-form.component";

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
    {
      path: '',
      component: MainContentComponent
    },
    {
      path: 'my-tasks',
      component: MyTasksListingComponent
    },
    {
      path: 'board',
      component: SprintBoardComponent
    },
    {
      path: 'product',
      component: ProductMngComponent
    },
    {
      path: 'retro',
      component: RetroComponent
    },
    {
      path: 'my-team',
      component: MyTeamComponent
    },
    {
      path: 'project',
      component: ProjectListingComponent
    },
    {
      path: 'project/new',
      component: ProjectFormComponent
    },
    {
      path: 'project/:id',
      component: ProjectFormComponent
    }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
