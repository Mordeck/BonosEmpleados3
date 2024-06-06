import { Component } from '@angular/core';
import { CriteriaEdtiService } from '../criteria-edti.service';
import { fadeInOut } from '../animations/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BACKSERVER } from '../app.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogService } from '../mat-dialog.service';
import { ActivityCriteriaService } from '../activity-criteria.service';

@Component({
  selector: 'app-edit-criteria',
  templateUrl: './edit-criteria.component.html',
  styleUrls: ['./edit-criteria.component.sass'],
  animations:[fadeInOut]
})
export class EditCriteriaComponent {
  criteria: any;
  description: any;
  weight = 0;
  httpHeaders: any;

  constructor(private _editCriSer:CriteriaEdtiService, private _http: HttpClient, private _snack: MatSnackBar, private _dialogServ: MatDialogService, private _actCriServ: ActivityCriteriaService)
  {
    this._editCriSer.getNewCriteriaObservable().subscribe({
      next:(criteria)=>{
        console.log('se esta estableciendo el criterio');
        console.log(criteria);


        this.criteria = criteria;
        this.description = this.criteria.description;
        this.weight = this.criteria.weighting;
      }
    })


    const token = localStorage.getItem("token") || "";
    this.httpHeaders = new HttpHeaders({
    'Authorization': `Bearer ${token}`
    });
  }

  guardarCriterio() {
    console.log('editando el criterio');
    console.log(this.criteria);
    const url  = BACKSERVER + '/updateCriteria'
    this._http.post(url, { oldData:this.criteria, newData:{ description:this.description, weighting: this.weight } }, {headers:this.httpHeaders }).subscribe({
      next:(result)=>{
        const res:any = result;
        console.log('el resultado ');
        console.log(res);

        if (res.status == 'success'){
          this._snack.open('Se actualizo el criterio', 'Cerrar', {duration:3000});
          this._dialogServ.closeDialog();
        }
        else {
          this._snack.open('Error: no se pudo actualizar', 'Cerrar', {duration:3000});
        }


      },
      error:(error)=>{console.log('sucedio un error en la petición');
      }
    })


  }

}
