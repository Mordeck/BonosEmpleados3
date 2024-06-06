import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { BACKSERVER } from '../app.module';
import { MatDialogService } from '../mat-dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-remove-criteria',
  templateUrl: './remove-criteria.component.html',
  styleUrls: ['./remove-criteria.component.sass']
})

export class RemoveCriteriaComponent {
  criteriaData: any;
  httpHeaders: HttpHeaders;

  constructor(private _http: HttpClient, private _dialogServ: MatDialogService, private _snack: MatSnackBar) {
    const token = localStorage.getItem("token") || "";
    this.httpHeaders = new HttpHeaders({
    'Authorization': `Bearer ${token}`    });

  }

  deleteCriteria() {
    const url = BACKSERVER + '/delCriteria'
    console.log("los datos a eliminar son ");
    console.log(this.criteriaData);
    const strCritData  = JSON.stringify(this.criteriaData)


    this._http.delete(url, { headers:this.httpHeaders, params: { criteriaData: strCritData} })
      .subscribe(
        {
          next: (result) => {
            const res: any = result;

            if (res.status == "success") {
              console.log('se ha eliminado el criterio')
              this._dialogServ.closeDialog();
              this._snack.open("Se ha eliminado el criterio", "Cerrar", { duration: 3000 })
            }

            else {
              console.log("no se pudo eliminar el registro");
            }
          },

          error:(error)=>{
            console.log("sucedio un error al realizar la petición");

          }
        })
  }



}


