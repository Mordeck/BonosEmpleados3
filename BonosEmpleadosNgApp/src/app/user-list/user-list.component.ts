import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { BACKSERVER } from '../app.module';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewUserFormComponent } from '../new-user-form/new-user-form.component';
import { MatDialogService } from '../mat-dialog.service';
import {  MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { fadeInOut } from '../animations/animations';
import { EdithUserFormComponent } from '../edith-user-form/edith-user-form.component';



@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.sass'],
  providers:[ { provide: MAT_DATE_LOCALE, useValue: 'es' }],
  animations:[fadeInOut]
})


export class UserListComponent implements OnInit
{
  @ViewChild('form', { read: ViewContainerRef }) formContainer!: ViewContainerRef;
  @ViewChild(MatSort) sort: MatSort | null = null;
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  searchText = "";
  userDataSource:UserData;
  displayedColumns = ['numEmp','userName', 'type', "fCreacion", "lastAccess", "department", "position", "Acciones" ];
  httpHeaders:HttpHeaders = new HttpHeaders();
  roles = new Array();

  constructor(private _http:HttpClient, private _dialog:MatDialog, private _dialogService: MatDialogService)
  {
    this.userDataSource = new UserData([]);
    console.log("user list");

    const token = localStorage.getItem("token") || "";
    this.httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });


    //cuando se cierra el form despues de haber agregado un usuario nuevo
    this._dialogService.listenCLoser().subscribe({
      next:()=>{
        console.log("actualizando lista de usuarios por accion de un form");

        //se actualiza la lista de usuario despues de agregar un nuevo
        this.loadUsers();
      }
    });

  }


  //-------hooks---------
  ngOnInit(): void {
    this.loadUsers();
    this.userDataSource.sort = this.sort;
  }

  ngAfterViewInit(): void {
    // Establecer el paginador y el sorting después de la vista inicializada
    this.userDataSource.paginator = this.paginator;
  }

  dialogEditRef:MatDialogRef<NewUserFormComponent> | null = null;
  openEditForm(user:any){
    console.log("abriendo edit form", user);
    const MatDialogRef:MatDialogRef<EdithUserFormComponent> = this._dialog.open(EdithUserFormComponent);
    MatDialogRef.componentInstance.setUserData(user);
    this._dialogService.setDialogRef(MatDialogRef)
  }

  dialogRemoveRef:MatDialogRef<NewUserFormComponent> | null = null;
  openRemoveForm(user:any){
    console.log("abriendo remove form");
    const MatDialogRef:MatDialogRef<EdithUserFormComponent> = this._dialog.open(EdithUserFormComponent);
    MatDialogRef.componentInstance.setUserData(user);
    this._dialogService.setDialogRef(MatDialogRef)
  }


  loadUsers()
  {
    const url = BACKSERVER + "/user";
    this._http.get(url, {headers:this.httpHeaders}).subscribe({
      next: resp =>{
        console.log("Los usuarios obtenidos: ",resp);
        let res:any = resp;
        try {
          this.userDataSource.data = res.recordset;
        } catch (error)
        {
          console.log("hubo un error al obtener los usuarios", error)
        }
        console.log("UserDatSource",this.userDataSource.data.length)
        this.userDataSource.sort = this.sort;
        registerLocaleData(localeEs, 'es');
      },
      error:error=>{
        console.log(error)
      }

    });

  }

  applyFilter()
  {
    this.userDataSource.filter = this.searchText.trim().toLowerCase();
  }

  goToDetail(user:any)
  {

  }

  newUserForm()
  {
    const dialogRef = this._dialog.open(NewUserFormComponent);
    this._dialogService.setDialogRef(dialogRef);
  }


}

interface UserDataInterface
{
  numEmp:number;
  userName:string;
  type:string;
  fCreacion:string;
  lastAccess:string;
}

class UserData extends  MatTableDataSource<UserDataInterface>
{
  constructor(initialData: UserDataInterface[]) {
    super(initialData);
  }
}


