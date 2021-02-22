import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ProjectService} from "../../../project/services/project.service";
import {Project} from "../../../project/models/project";
import {MatSnackBar} from "@angular/material";
import {GlobalsService} from '../../../../globals/globals';
import {SprintBoardComponent} from "../../../sprint-board/sprint-board/sprint-board.component";
import {ProductMngComponent} from "../../../product-mng/product-mng/product-mng.component";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  projects: Project[] =[];
  opened: boolean;
  @Output() toggleSidenav = new EventEmitter<void>();
  projectId;
  constructor( private snackBar: MatSnackBar,
               private projectService: ProjectService,
               private sprintBoardComp: SprintBoardComponent,
               private productComp: ProductMngComponent,
               private globalService: GlobalsService) { }

  ngOnInit() {
    this.setProjects();
    this.globalService.currentId.subscribe(msg => this.projectId == msg );
  }

  private setProjects(){
    this.projectService.getProjects({
      page: 0,
      perPage: 100,
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
    let target = event.source.selected._element.nativeElement;
    let selectedData = {
      value: event.value,
      text: target.innerText.trim()
    };
    //this.globals.project_id = selectedData.value;
    this.globalService.changeId(selectedData.value);
    this.sprintBoardComp.project_id = selectedData.value;
    this.productComp.projectId = selectedData.value;
    this.productComp.setProject(selectedData.value);
    this.productComp.ngOnInit();
    this.sprintBoardComp.ngOnInit();
    console.log(selectedData);
  }

  private errorHandler(error, message) {
    console.log(error);
    this.snackBar.open(message, 'Error', {
      duration: 2000
    });
  }
}
