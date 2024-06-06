import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BACKSERVER } from '../app.module';

@Component({
  selector: 'app-conf-del-activity',
  templateUrl: './conf-del-activity.component.html',
  styleUrls: ['./conf-del-activity.component.sass']
})
export class ConfDelActivityComponent {
  documentData:any = [];
  httpHeaders: HttpHeaders;

  constructor(private _http:HttpClient, private _snack: MatSnackBar)
  {
    const token = localStorage.getItem("token") || "";
    this.httpHeaders =
     new HttpHeaders({ 'Authorization': `Bearer ${token}`   });
  }

  eliminar(documentData:any)
  {
    console.log("eliminando el la actividad", documentData);
    const body = { documentId:documentData.documentId, activityId:documentData.activityId };

    const url = BACKSERVER  + "/activity";

    this._http.delete(url, {headers:this.httpHeaders, body:body})
    .subscribe({
      next:(result) =>{
        const res: any = result;

        if ( res.status == 'success' )
        {
          this._snack.open("Se ha eliminado correctamente", "Cerrar");
        }

        else
        {
          this._snack.open("No se púdo eliminar la actividad", "Cerrar");

        }

      }})
  }

}
