import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddprojectsComponent } from './addprojects/addprojects.component';
import { EditprojectsComponent } from './editprojects/editprojects.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ViewprojectsComponent } from './viewprojects/viewprojects.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'add-projects', component: AddprojectsComponent },
  { path: 'edit-projects/:id', component: EditprojectsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'view', component: ViewprojectsComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
