import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AddprojectsComponent } from './addprojects/addprojects.component';
import { SignupComponent } from './signup/signup.component';
import { EditprojectsComponent } from './editprojects/editprojects.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { ToastrModule } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';

import { HttpClientModule } from '@angular/common/http';
import { ViewprojectsComponent } from './viewprojects/viewprojects.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatSortModule } from '@angular/material/sort';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from 'src/environments/environment';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { hasCustomClaim, canActivate } from '@angular/fire/compat/auth-guard';


const routes: Routes = [

]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AddprojectsComponent,
    SignupComponent,
    EditprojectsComponent,
    ViewprojectsComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    ToastrModule.forRoot(),
    ButtonModule,
    HttpClientModule,
    NgxPaginationModule,
    MatSortModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule,









  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
