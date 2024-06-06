import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BACKSERVER } from '../app.module';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogService } from '../mat-dialog.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-new-user-form',
  templateUrl: './new-user-form.component.html',
  styleUrls: ['./new-user-form.component.sass']
})

export class NewUserFormComponent implements AfterViewInit
{
  httpHeaders:HttpHeaders = new HttpHeaders()
  roles: any[] =  [];
  typeSelected:string = "";
  mode = "CREATE";
  formTitle = "Agregando Nuevo Usuario"; //encabezado del form

  userDepartment = 0;
  userPosition  = "";

  departmentsList:any = [];
  positionsList:any = [];


  @ViewChild('pass')      pass:     ElementRef = new ElementRef<any>("");
  @ViewChild('confPass')  confpass: ElementRef = new ElementRef<any>("");
  @ViewChild('userName')  userName: ElementRef = new ElementRef<any>("");
  @ViewChild('numEmp')    numEmp:   ElementRef = new ElementRef<any>("");
tempPassC: any;

  constructor(private _http:HttpClient,
              private _snack: MatSnackBar,
              private _dialogService: MatDialogService,
              private _dialog: MatDialog
               )
              {

    const token = localStorage.getItem("token") || "";
    this.httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.getUserTypes();
    this.getDepartments();
  }

  protected depChange()
  {
    this.getPositionsByDepartment(this.userDepartment)
  }


  private getPositionsByDepartment(departmentId:number)
  {
    const url = BACKSERVER + '/positionsByDep';
    this._http.get(url, {headers:this.httpHeaders , params:{departmentId}})
    .subscribe({next:(result)=>{
      console.log("el resultado al solicitar las posiciones", result);
      const res:any = result;
      if (res.status === "success"){
        this.positionsList = res.data
      }
      else {
        console.log("sucedio un error al solicitar los puestos");

      }

    }})
  }


  private getDepartments()
  {
    const url = BACKSERVER + "/departments";

    this._http.get( url, {headers:this.httpHeaders})
    .subscribe({
      next:(result)=>{
        //console.log("el resultado de solicitar los departamentos", );
        const resp:any = result;
        console.log(resp);

        if (resp.status == "success"){
          console.log("el data es:", resp.data);

          this.departmentsList =  resp.data;
        }
      },
    error:(error)=>{
      console.log("succedio un error al solicitar los departamentos", error);

    }});
  }

  getUserTypes()
  {
    console.log("Buscando los roles");

    let url = BACKSERVER + "/roles"
    this._http.get(url, {headers:this.httpHeaders}).subscribe({
      next:(resp)=>{
        let res:any = resp;
        console.log("se han obtenido los roles", res );
        this.roles = res.recordset;
        this.addAestheticNames()
      },
      error:(error)=>{
        console.log("ocurrio un error al obtener los roles", error)
      }
    }
    )
  }


  getAestheticName(name:string)
  {
    switch(name){
      case "admin":
        return "Administrador";

      case "evalu":
        return "Evaluador";

      case "viewe":
      return "Visualizador";

      default: return "Rol desconocido";

    }

  }

  addAestheticNames()
  {
    this.roles.forEach((role)=>{
      role.aName = this.getAestheticName(role.name)
    });

    console.log("los roles ahora son ", this.roles)
  }

  /**
   * determina si la accion es editar usuario, eliminar usuario o crear usuario
   */


  removeUser()
  {
    console.log("el formulario esta en modo remove");

    let url = BACKSERVER + "/user"
    this._http.delete(url, {headers:this.httpHeaders, body:{ userToDel: this.tempUserName, numEmp: this.userName }}).subscribe({
      next:(resp)=>{
        let res:any = resp;
        console.log("Respuesta de eliminacion de usuario", res );
        this._dialogService.closeDialog();

      },
      error:(error)=>{
        console.log("ocurrio un error al eliminar al usuario", error)
      }
    }
    )
  }


  tempPass:any;
  tempUserName:any;
  tempNumEmp:any;
  tempType:any;

  setUserData(userData:any)
  {
    console.log("estableciendo los datos del usuario en el form", userData);
    this.tempUserName = userData.userName;
    this.tempPass     = "poner la contraseña no es necesario aqui";
    this.tempNumEmp   = userData.numEmp;
    this.confpass = this.pass;
    this.typeSelected = userData.type;
  }

  setUserDataInForm()
  {
    this.pass.nativeElement.value = this.tempPass;
    this.confpass.nativeElement.value = this.tempPass;
    this.userName.nativeElement.value = this.tempUserName
    this.numEmp.nativeElement.value = this.tempNumEmp;
    this.typeSelected = this.tempType;

  }

  ngAfterViewInit()
  {
    this.setUserDataInForm

  }

  sendNewUser()
  {

    let body = this.fieldsFilledValidator()

    let url = BACKSERVER + "/NewUser"

    console.log(this.httpHeaders);

    this._http.post(url,  body , { headers:this.httpHeaders } ).subscribe({
      next:(resp)=>
      {
        let res:any = resp;
        console.log("Se envio la peticion correctamente", res );

        if (res.status == "success")
        {
          this._snack.open("Se agrego el usuario","Cerrar", { verticalPosition:"top", duration:3000 });
          this._dialogService.closeDialog();
        }

        else if (res.status == "error")
        {
          this._snack.open(res.message.info.message, "cerrar", {
            duration: 2000,
            verticalPosition:"top",
          });

          this._dialogService.closeDialog();
        }
      },
      error:(error)=>{
        console.log("ocurrio un error al insertar el usuario", error);
        this._dialogService.closeDialog();
      }
    }
    )

  }

  /**
   * valida si todos los campos estan llenos
   * returna true si es asi
   */
  fieldsFilledValidator()
  {
    let pass     = this.pass.nativeElement.value;
    let confpass = this.confpass.nativeElement.value;
    let userName = this.userName.nativeElement.value;
    let numEmp   = this.numEmp.nativeElement.value;
    let typeSelector = this.typeSelected;

    if ( pass != confpass )
    {
      this._snack.open("Diferencia en contraseñas: \nFavor de validar", "Cerrar")
      return null;
    }

    if (typeSelector == '')
    {
      this._snack.open("El campo \"Tipo usuario\" es obligatorio ", "Cerrar");
      return null;
    }

    if(userName == '')
    {
      this._snack.open("El campo \"Nombre de usuario\" es obligatorio ", "Cerrar");
      return null;
    }

    if(pass == '')
    {
      this._snack.open("Favor de validar la contraseña", "Cerrar");
      return null;
    }

    const department = this.userDepartment;
    const position   = this.userPosition;

    return { pass, userName, type:typeSelector, numEmp, department, position };
  }

}
