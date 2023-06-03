import { ElementRef, OnInit, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { countries } from '../countries_data';
import { FileUpload } from '../Image';

@Component({
  selector: 'app-addprojects',
  templateUrl: './addprojects.component.html',
  styleUrls: ['./addprojects.component.css']
})
export class AddprojectsComponent implements OnInit {
  addForm: any;
  projectCategories: any[] | undefined;
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  percentage = 0;
  public countries: any = countries;
  imageUrl: string = '';

  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private projectservice: ApiService,
    private toastr: ToastrService
  ) {
    this.addForm = this.formbuilder.group({
      // project_id: ['', [Validators.required, Validators.min(1), Validators.pattern("^[0-9]+$")]],
      title: ['', [Validators.required, Validators.maxLength(255), Validators.pattern("^[a-zA-Z]+$")]],
      description: ['', [Validators.required, Validators.maxLength(255), Validators.pattern("^[a-zA-Z]+$")]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      code_cat: ['', [Validators.required, Validators.min(1), Validators.pattern("^[0-9]+$")]],
      project_country: ['', [Validators.required]],
      project_holder: ['', Validators.required],
      image_url: ['']
    }, { validator: this.endDateValidator });
  }

  endDateValidator(group: AbstractControl): ValidationErrors | null {
    const startDate = group.get('start_date')?.value;
    const endDate = group.get('end_date')?.value;

    if (startDate && endDate && startDate > endDate) {
      return { endDateInvalid: true };
    }
    return null;
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }
  downloadURL: string = '';



  async onSubmit() {
    if (this.addForm.valid && this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);

        try {
          await this.projectservice.pushFileToStorage(this.currentFileUpload).toPromise();
          await this.projectservice.createProjects(this.addForm.value).toPromise();

          this.toastr.success('Project created successfully', 'Success');
          setTimeout(() => {
            this.router.navigate(['/view']);
          }, 1500);
        } catch (error) {
          console.log(error);
          this.toastr.error('Project ID already exists', 'Error');
        }
      }
    } else {
      this.toastr.error('Please fill the form correctly', 'Error');
    }
  }


  get id() {
    return this.addForm.get('project_id');
  }

  ngOnInit() {
    this.projectservice.getCategory().subscribe(
      (result: any) => {
        this.projectCategories = result.data;
        console.log(this.projectCategories);
      },
      error => {
        // Handle error
      }
    );
  }
}
