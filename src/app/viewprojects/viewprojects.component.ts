import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { projects } from 'src/projects';
import { MatPaginator } from '@angular/material/paginator';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationInstance } from 'ngx-pagination';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';

import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-viewprojects',
  templateUrl: './viewprojects.component.html',
  styleUrls: ['./viewprojects.component.css'],
})

export class ViewprojectsComponent implements OnInit {
  projects: any;
  p: number = 1;
  dataSource: any;
  searchTerm: any;



  sortData(sort: Sort) {
    const data = this.projects.slice();
    if (!sort.active || sort.direction === '') {
      this.projects = data;
      return;
    }

    this.projects = data.sort((a: { project_id: string | number; start_date: string | number; end_date: string | number; }, b: { project_id: string | number; start_date: string | number; end_date: string | number; }) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'project_id': return this.compare(a.project_id, b.project_id, isAsc);
        case 'start_date': return this.compare(a.start_date, b.start_date, isAsc);
        case 'end_date': return this.compare(a.end_date, b.end_date, isAsc);
        default: return 0;
      }
    });
  }

  originalProjects: any[] | undefined;
  constructor(private projectservice: ApiService, private router: Router, private toastr: ToastrService, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.projectservice.getProjects().subscribe(
      (result: any) => {
        console.log(result)
        this.projects = result.data;
        this.originalProjects = [...result.data];
      }



    )


  }



  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }


  filterData() {
    this.projects = this.projects.filter((d: { name: string | any[]; }) => d.name.indexOf(this.searchTerm) !== -1);

  }
  onKeyUp() {
    if (!this.searchTerm) {
      this.projects = this.originalProjects
    }
  }
  onKeyDown(event: { keyCode: number; }) {
    if (!this.searchTerm) {
      this.filterData();
    } else if (event.keyCode === 8) {
      this.filterData();
    }
  }

  onEdit(id_project: number) {
    this.router.navigate(['/edit-projects', id_project]);
  }




}