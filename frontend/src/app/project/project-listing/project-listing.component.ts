import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ProjectService} from "../services/project.service";
import {Project} from "../models/project";
import {Router} from "@angular/router";
import {MatPaginator, MatSnackBar, MatSort} from "@angular/material";
import {remove} from 'lodash';
import {flatMap} from "rxjs/internal/operators";
//import {Globals} from '../../../globals/globals';


@Component({
  selector: 'app-project-listing',
  templateUrl: './project-listing.component.html',
  styleUrls: ['./project-listing.component.scss']
})
export class ProjectListingComponent implements OnInit, AfterViewInit{

  constructor(private projectService: ProjectService, private router: Router, public snackBar: MatSnackBar ) { }
  displayedColumns: string[] = ['id','name', 'dueDate', 'action'];
  dataSource: Project[] = [];
  resultsLength = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  newProjectBtn(){
    this.router.navigate(['dashboard', 'project', 'new']);
  }

  deleteProjectBtn(id){
    this.projectService.deleteProject(id)
      .subscribe(data => {
        const removeItems = remove(this.dataSource,(project) => {
          return project._id === data._id
        });
          this.dataSource = [...this.dataSource];
          this.snackBar.open('Project deleted', 'Success', {
            duration: 2000
          })
        }, err => this.errorHandler(err, 'Failed to delete project'));
  }

  editProjectBtn(id){
    this.router.navigate(['dashboard', 'project', id]);
  }

  filterText(filterValue: string){
    filterValue = filterValue.trim();
    this.paginator.pageIndex = 0;
    this.projectService.getProjects({
      page: this.paginator.pageIndex,
      perPage: this.paginator.pageSize,
      sortField: this.sort.active,
      sortDir: this.sort.direction,
      filter: filterValue
    })
      .subscribe(data => {
          this.dataSource = data.docs;
          this.resultsLength = data.total;
      }, err => this.errorHandler(err,'Failed to filter projects'));
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(() =>
    {
         this.projectService.getProjects({
          page: this.paginator.pageIndex,
          perPage: this.paginator.pageSize,
          sortField: this.sort.active,
          sortDir: this.sort.direction,
          filter: ''
        })
          .subscribe(data => {
            this.dataSource = data.docs;
            this.resultsLength = data.total;
          });
      }, err => this.errorHandler(err, 'Failed to fetch projects'));
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
        this.projectService.getProjects({
        page: this.paginator.pageIndex,
        perPage: this.paginator.pageSize,
        sortField: this.sort.active,
        sortDir: this.sort.direction,
        filter: ''
      })
        .subscribe((data) => {
          this.dataSource = data.docs;
          this.resultsLength = data.total;
        });
    });
    this.populateProjects();

    //console.log(this.globals.project_id);
  }


  private populateProjects(){
    this.projectService.getProjects({
      page: this.paginator.pageIndex,
      perPage: this.paginator.pageSize,
      sortField: this.sort.active,
      sortDir: this.sort.direction,
      filter: ''
    }).subscribe(
      data => {
        this.dataSource = data.docs;
        this.resultsLength = data.total;
        console.log(data);
        console.log("dir" + this.sort.direction);
      },
      err => this.errorHandler(err, 'Failed to fetch projects'));
  }

  private errorHandler(error, message){
    console.error(error);
    this.snackBar.open(message, 'Error', {
      duration: 2000
    });
  }

}
