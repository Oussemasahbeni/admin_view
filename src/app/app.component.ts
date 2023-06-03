import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MenuItem } from 'primeng/api';
import { ApiService } from './service/api.service';
import { Router, RouterModule } from '@angular/router';
import { AES, enc } from 'crypto-js';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'stage';
  items: MenuItem[] = [];
  logoFadeInState = 'in';
  isUserLoggedIn = false;
  username: string = '';
  user: any;

  constructor(private service: ApiService, private router: Router,) { }



  ngOnInit() {
    this.items = [
      { label: 'New', icon: 'pi pi-fw pi-plus' },
      { label: 'Open', icon: 'pi pi-fw pi-download' },
      { label: 'Undo', icon: 'pi pi-fw pi-refresh' }
    ];



    const storedData = localStorage.getItem('user');
    if (storedData) {
      const { expiryTime: storedExpiryTime, encryptedData: storedEncryptedData } = JSON.parse(storedData);

      if (new Date().getTime() < storedExpiryTime) {
        const decryptedData = AES.decrypt(storedEncryptedData, 'ISETRADES2023').toString(enc.Utf8);
        const user = JSON.parse(decryptedData);

        this.isUserLoggedIn = true;
        this.user = user;
        this.username = this.user.username;
        this.service.updateUsername(this.username);
        this.service.changeLoginStatus(this.isUserLoggedIn);
      } else {
        this.isUserLoggedIn = false;
        this.service.changeLoginStatus(this.isUserLoggedIn);
        localStorage.removeItem('user');
      }
    } else {
      this.isUserLoggedIn = false;
      this.service.changeLoginStatus(this.isUserLoggedIn);
    }

    this.service.currentLoginStatus.subscribe(status => {
      this.isUserLoggedIn = status;
    });


    this.service.currentUsername.subscribe(username => {
      this.username = username;
      console.log(username)
    });
  }
  logout() {
    this.service.changeLoginStatus(false);
    this.isUserLoggedIn = false;
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  showMenu = false
  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}
