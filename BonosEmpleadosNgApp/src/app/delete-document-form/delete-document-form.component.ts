import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { BACKSERVER } from '../app.module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-document-form',
  templateUrl: './delete-document-form.component.html',
  styleUrls: ['./delete-document-form.component.sass']
})
export class DeleteDocumentFormComponent
{
  documentData:any;
  httpHeaders: HttpHeaders;

  constructor(private _http: HttpClient, private _snack:MatSnackBar)
  {
    const token = localStorage.getItem("token") || "";

    this.httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

  }

  sendDelete()
  {
    const url = BACKSERVER + '/delDocument'
    this._http.delete(url,{headers:this.httpHeaders, body: this.documentData })
    .subscribe({
      next:(result)=>{
        console.log("al eliminar el documento");
        console.log(result);
        const res:any = result;
        if ( res.status == 'success' )
        {this._snack.open('se ha eliminado el documento', 'Cerrar', {duration:3000})}
      },
      error:(error)=>{console.log(error);
      }
    })

  }
}
