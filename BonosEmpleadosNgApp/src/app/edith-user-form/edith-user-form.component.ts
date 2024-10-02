import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BACKSERVER } from '../app.module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edith-user-form',
  templateUrl: './edith-user-form.component.html',
  styleUrls: ['./edith-user-form.component.sass']
})
export class EdithUserFormComponent {
  departmentsList: any;
  positionsList: any;
  roles: any[] = [];
  userPosition: any;
  typeSelected: any;
  tempPass: any;
  tempPassC: any;
  userData: any;
  tempUserName: any;
  tempNumEmp: any;
  userDepartment: any;

  constructor(private _http:HttpClient, private _snack: MatSnackBar)
  {

   this.getDepartments();
   this.getUserTypes();

  }

  depChange() {
    this.getPositionsByDepartment(this.userDepartment)

  }

  private getPositionsByDepartment(departmentId:number)
  {
    const url = BACKSERVER + '/positionsByDep';
    this._http.get(url, { params: { departmentId } } )
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

  updateUser()
  {
    console.log('actualizando el usuario');
    console.log("Nombre",   typeof this.tempUserName );
    console.log("Número",   typeof this.tempNumEmp );
    console.log("Depart",   typeof this.userDepartment );
    console.log("position", typeof this.userPosition );
    console.log("type",   typeof this.typeSelected );
    console.log('pass',   typeof this.tempPass );



    if (this.tempUserName  == '' || this.tempNumEmp == 0 || this.userDepartment == null || this.typeSelected == null || this.userPosition == null)
    {
      this._snack.open('Por favor revisa los datos', 'Cerrar', { duration:5000 });
      return;
    }

    if ( this.tempPass != this.tempPassC  )
    {
      this._snack.open('las contraseñas son distintas', 'Cerrar', { duration:5000 });
      return;
    }

    if ( this.tempPass.length ==  0 )
    {

      this._snack.open('Revisa la contraseña', 'Cerrar', { duration:5000 });
      return;
    }

    const url = BACKSERVER + '/updateUser';

    const body = {  name: this.tempUserName,
                    number: this.tempNumEmp,
                    department: this.userDepartment,
                    type:this.typeSelected,
                    pass: this.tempPass,
                    pos: this.userPosition }

    this._http.post( url, body )
    .subscribe({next:(result:any)=>
      {
        if (result.status == 'success'){
          this._snack.open('Se actualizo correctamente el usuario', 'Cerrar', {duration:5000});
        }
        else {
          this._snack.open('No se pudo actualizar el usuario');
        }
    },
  error:(error)=>{
    console.log('hubo un error al solicitar la actualización', error);

  }})



  }

  getUserTypes()
  {
    console.log("Buscando los roles");

    let url = BACKSERVER + "/roles"
    this._http.get(url).subscribe({
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

  addAestheticNames()
  {
    this.roles.forEach((role)=>{
      role.aName = this.getAestheticName(role.name)
    });

    console.log("los roles ahora son ", this.roles)
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

  private getDepartments()
  {
    const url = BACKSERVER + "/departments";

    this._http.get( url)
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

  setUserData(user: any) {
    console.log('datos del usuario en el edit');
    this.tempUserName = user.userName;
    this.tempNumEmp = user.numEmp;
    this.userDepartment = user.department
    console.log(this.userData);

  }

}
