import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  addForm: any;
  isUserLoggedIn: boolean = false;

  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private projectservice: ApiService,
    private toastr: ToastrService,

  ) {
    this.addForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', Validators.required],
    }
    )
    this.projectservice.currentLoginStatus.subscribe(status => {
      this.isUserLoggedIn = status;

      if (this.isUserLoggedIn) {
        this.router.navigate(['/view']);
      }
    });
  }
  onSubmit() {
    if (this.addForm.valid) {
      this.projectservice.login(this.addForm.value.email, this.addForm.value.password).subscribe({
        next: (data: any) => {
          if (data.success) {
            this.projectservice.changeLoginStatus(true);
            const username = data.username;
            this.projectservice.updateUsername(data.username);
            this.toastr.success(`Login successful, welcome ${username}`, 'Success');
            setTimeout(() => {
              this.router.navigate(['/view']);
            }, 2500);
          } else {
            this.toastr.error(data.message, 'Error');
          }
        },
        error: (error: any) => {
          console.log(error);
          this.toastr.error('Something wrong happened', 'Error');
          this.projectservice.changeLoginStatus(false);
        }
      });
    } else {
      this.toastr.error('please fill the form with your credentials', 'Error');
    }
  }



  get email() {
    return this.addForm.get('email')
  }
  get password() {
    return this.addForm.get('password')
  }


  showPassword = false;
  password1 = '';
  visibility = false;

  toggleVisibility() {
    this.visibility = !this.visibility;
  }



}

