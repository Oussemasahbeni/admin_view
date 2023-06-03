import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { projects } from 'src/projects';
import { ActivatedRoute } from '@angular/router';
import { Observable, finalize } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { AES, enc } from 'crypto-js';
import { Category } from '../Category';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FileUpload } from '../Image';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  projectId: any;
  image: string = '';
  private isUserLoggedIn = new BehaviorSubject(false);
  currentLoginStatus = this.isUserLoggedIn.asObservable();

  baseUrl: String = 'http://localhost/backendadmin/';
  private basePath = '/uploads';

  private username = new BehaviorSubject('');
  currentUsername = this.username.asObservable();

  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();
  private token: any;


  constructor(private http: HttpClient, private route: ActivatedRoute, private db: AngularFireDatabase, private storage: AngularFireStorage) {
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
    });
  }


  pushFileToStorage(fileUpload: FileUpload): Observable<number | undefined> {
    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    return new Observable((observer) => {
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((downloadURL: string) => {
            fileUpload.url = downloadURL;
            this.image = downloadURL;
            console.log('image=' + this.image);
            console.log('downloadurl=' + downloadURL);
            fileUpload.name = fileUpload.file.name;
            this.saveFileData(fileUpload);

            // Invoke the callback function with the downloadURL
            observer.next();
            observer.complete();
          });
        })
      ).subscribe();
    });
  }

  createProjects(project: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });


    const image = encodeURIComponent(this.image);

    // Append the image_url to the URL string
    const url = `${this.baseUrl}addproject.php?image_url=${image}`;

    console.log(project);
    console.log(image);
    console.log(url);

    return this.http.post(url, project, { responseType: 'text' },);
  }

  private saveFileData(fileUpload: FileUpload): void {
    this.db.list(this.basePath).push(fileUpload);
    console.log('image=' + this.image)
  }
  getFiles(numberItems: number): AngularFireList<FileUpload> {
    return this.db.list(this.basePath, ref =>
      ref.limitToLast(numberItems));
  }
  deleteFile(fileUpload: FileUpload): void {
    this.deleteFileDatabase(fileUpload.key)
      .then(() => {
        this.deleteFileStorage(fileUpload.name);
      })
      .catch(error => console.log(error));
  }

  private deleteFileDatabase(key: string): Promise<void> {
    return this.db.list(this.basePath).remove(key);
  }

  private deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(name).delete();
  }



  updateUsername(username: string) {
    this.username.next(username);
  }


  getProjects() {
    return this.http.get<projects[]>(this.baseUrl + 'viewprojects.php');
  }


  getCategory() {
    return this.http.get<Category[]>(this.baseUrl + 'getCat.php');

  }
  getSingleProject(id: any) {

    return this.http.get<projects[]>(this.baseUrl + 'viewprojects.php?id=' + id);
  }
  deleteProjects(id: any) {
    console.log(id);
    return this.http.delete(this.baseUrl + 'deleteproject.php?id=' + id);
  }

  login(email: any, password: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body = { email, password };
    let data = JSON.stringify(body);
    return new Observable((observer) => {
      this.http.post(this.baseUrl + 'login.php', data, { headers }).subscribe(
        (response) => {
          const data = JSON.stringify(response);
          const encryptedData = AES.encrypt(data, 'ISETRADES2023').toString();
          const expiryTime = new Date().getTime() + 60 * 60 * 10000; // 1 hour from now
          const encryptedDataWithExpiry = JSON.stringify({ expiryTime, encryptedData });
          localStorage.setItem('user', encryptedDataWithExpiry);
          console.log(localStorage);
          observer.next(response);
          observer.complete();
        },
        (error) => {
          console.error(error);
          observer.error(error);
        }
      );
    });
  }
  isAuthenticated(): boolean {
    return this.token != null;
  }

  getToken() {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  setToken(token: string) {
    this.token = token;
  }
  changeLoginStatus(value: boolean) {
    this.isUserLoggedIn.next(value);
  }





  createUser(user: any) {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let data = JSON.stringify(user);
    return this.http.post(this.baseUrl + 'addusers.php', data, { headers });

  }


  editProjects(project: any) {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let data = JSON.stringify(project);
    return this.http.put(this.baseUrl + 'updateproject.php', project);
  }



}
