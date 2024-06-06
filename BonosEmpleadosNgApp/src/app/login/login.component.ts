import { Component, ViewChild, ViewContainerRef, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

//services
import { DynamicComponentService } from '../dynamic-component.service';
import { DashBoardFeederService } from '../dash-board-feeder.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})

export class LoginComponent
{
  loading: boolean = false; //controlador del spinner
  show: boolean = true; //controla el renderizado de este mismo componente
  private backServer = 'http://10.20.1.57:4201/';

  @ViewChild('usernameInput') usernameInput: ElementRef | undefined;
  @ViewChild('passwordInput') passwordInput: ElementRef | undefined;
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dinCompContainer!: ViewContainerRef;

  constructor(private _snackBar: MatSnackBar,
    private dynamicComponents: DynamicComponentService,
    private dashboardFeeder: DashBoardFeederService,
    private _http: HttpClient,
    private _router: Router)
    {

    this.dynamicComponents.getData().subscribe((data) => {
      const { created } = data;
      this.show = false;
    });

    localStorage.clear()
  }

  getTokenStatus()
  {
    this._http.get(this.backServer).subscribe({
      next:(resp)=>{
        //console.log("la session", resp);
      },
      error:(error)=>{
        //console.log("ha ocurrido un error", error);
      }
    });
  }

  //buscando el usuario
  sendAuth(event: Event): void {
    this.loading = true;

    if (this.usernameInput && this.passwordInput) {
      let strUser = this.usernameInput.nativeElement.value;
      let strPass = this.passwordInput.nativeElement.value;

      let body = { user: strUser, pass: strPass };
      let headers  = { 'Content-Type': 'application/json' };

      this._http.post('http://10.20.1.57:4201/auth', body, ).subscribe({
        next: ( resp: any ) =>
        {
          //console.log(resp);
          if ( resp.status == "success" )
          {
            const token = resp.token;
            //document.cookie = `authorization=Bearer ${token}; Secure; SameSite=None; path=/; httpOnly=true`;
            localStorage.setItem('token', token);
            localStorage.setItem('userData', JSON.stringify( resp.userData ) );
            localStorage.setItem("tabs", JSON.stringify( resp.permissions.recordset) );
            let compName = this.getDashboardComponent(resp).view;
            compName = compName.trim();
            //console.log("Login:", resp);
            this._router.navigate( [compName] );
            //this.dynamicComponents.loadComponent(compName, this.dinCompContainer);
            this.dashboardFeeder.setUserData(resp);
            this.loading = false;
          }

          if (resp.status == "error")
          {
            this._snackBar.open("Error al firmarse " + resp.message ,"Cerrar"  );
            this.loading = false;

          }


        },
        error: error => {
          console.log("hubo un error al solicitar la busqueda el usuario");
          console.log(error);
        }
         })
    }
  }

  getDashboardComponent(userdata:any)
  {
    let dc = "";
    for( let i = 0; i < userdata.permissions.recordset.length; i++ )
    {
      if (userdata.permissions.recordset[i].component === 1)
      {

        return userdata.permissions.recordset[i];
      }
    }

    return null;
  }

}
