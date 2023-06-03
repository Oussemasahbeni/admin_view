import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-editprojects',
  templateUrl: './editprojects.component.html',
  styleUrls: ['./editprojects.component.css']
})
export class EditprojectsComponent implements OnInit {

  addForm: any;
  project_id: any;
  data: any;
  projectdata: any;
  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private projectservice: ApiService,
    private url: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.addForm = this.formbuilder.group({
      project_id: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(255), Validators.pattern("^[a-zA-Z]+$")]],
      description: ['', [Validators.required, Validators.maxLength(255), Validators.pattern("^[a-zA-Z]+$")]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      code_cat: ['', Validators.required],

    }
    )
  }
  ngOnInit(): void {
    this.project_id = this.url.snapshot.params['id'];
    if (this.project_id > 0) {
      this.projectservice.getSingleProject(this.project_id).subscribe((
        (data: any) => {
          this.projectdata = data.data;

          console.log(data);

          this.addForm.patchValue(this.projectdata);

        }
      ))
    }
  }
  onEdit() {
    this.projectservice.editProjects(this.addForm.value).subscribe({
      next: (data: any) => {
        this.toastr.success('Project Edited successfully', 'Success');
        setTimeout(() => {
          this.router.navigate(['/view']);
        }, 2000);
      },
      error: (error: any) => {
        console.log(error);
        this.toastr.error('Failed to edit Project', 'Error');
      }
    });
  }

}
