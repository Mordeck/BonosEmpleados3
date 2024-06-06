import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialogService } from '../mat-dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BACKSERVER } from '../app.module';

@Component({
  selector: 'app-delete-document-confirm',
  templateUrl: './delete-document-confirm.component.html',
  styleUrls: ['./delete-document-confirm.component.sass']
})
export class DeleteDocumentConfirmComponent
{
  documentData : any  = null;
  httpHeaders: HttpHeaders = new HttpHeaders();

  constructor(private _http:HttpClient, private _dialogService:MatDialogService, private _snack: MatSnackBar)
  {

  }

  eliminar(){
    console.log("Eliminando el documento", this.documentData);
    const docId = this.documentData.documentId;
    const url = BACKSERVER + '/document';
    const body = { documentId: docId };

    const token = localStorage.getItem("token") || "";
    this.httpHeaders = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });


    this._http.delete( url, {body, headers:this.httpHeaders}).subscribe(
      { next:result=>{
        console.log("al solicitar eliminacion del doc ", result);
        const resp:any = result;
        if (resp.status == "success")
        {
          this._snack.open("Se ha eliminado el documento", "cerrar");
          this._dialogService.closeDialog();
        }

      },
    error:error=>{
      console.log("error al borrar: ", error);
    }}
    );

  }

}
