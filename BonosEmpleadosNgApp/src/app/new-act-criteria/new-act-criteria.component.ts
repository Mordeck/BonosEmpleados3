import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BACKSERVER } from '../app.module';
import { MatDialogService } from '../mat-dialog.service';
import { fadeInOut } from '../animations/animations';
import { ActivityCriteriaService } from '../activity-criteria.service';

@Component({
  selector: 'app-new-act-criteria',
  templateUrl: './new-act-criteria.component.html',
  styleUrls: ['./new-act-criteria.component.sass' ],
  animations:[ fadeInOut ]
})
export class NewActCriteriaComponent {
  description="";
  weight=0;
  activityId = 0;
  criteriaType:any;
  criteriaTypes:any;
  httpHeaders: HttpHeaders = new HttpHeaders();
  firstDate = "";
  secondDate = ""
  months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];


  constructor(
    private _snack:MatSnackBar,
    private _http: HttpClient,
    private dialogService:MatDialogService,
    private _actCriteriaService: ActivityCriteriaService
    )
  {

    const token = localStorage.getItem("token") || "";
    this.httpHeaders =
     new HttpHeaders({ 'Authorization': `Bearer ${token}`   });
    this.getCriteriaTypes();

  }

  showSelected(){
    console.log("imprimiendo el criterio");
    console.log(this.criteriaType);

  }

  onFirstDateChange(event:any)
  {
    const date = new Date(event);
    this.firstDate = date.getMonth().toString().padStart(2,'0');

  }

  onSecondDateChange(event:any)
  {
    const date = new Date(event);
    this.secondDate = date.getMonth().toString().padStart(2,'0');

  }



  getCriteriaTypes()
  {
    const url = BACKSERVER + '/criteriaTypes';
    this._http.get(url,{headers:this.httpHeaders}).subscribe(
      {
        next:(result)=>{
          const res:any = result;
          if (res.status === "success")
          {
            this.criteriaTypes = res.data;
          }

          else {
            console.log("sucedio un error al solicitar los tipos de criterios");

          }
        }
      }
    )
  }

  guardarCriterio()
  {
    if (this.description == "")
    {
      this._snack.open("Debes agregar una descripción","Cerrar")
      return;
    }

    if ( this.criteriaType.typeId == 3 )
    {
      if (this.firstDate == "" || this.secondDate  == "")
      {
        this._snack.open("Debes seleccionar un rango de fechas","Cerrar");
        return;
      }
    }

    if ( this.criteriaType.typeId == 3 )
    {
      this.description = this.description + '-' + this.firstDate + ',' + this.secondDate;
    }

    const url = BACKSERVER +  "/criteria"



  if(this.activityId === 0 )
  {
    console.error("la actividada id no puede ser cero");
    return;
  }

    const criteriaId = this.criteriaType.typeId;

    const body = { activityId:this.activityId, description : this.description, weight: this.weight, criteriaId:criteriaId };

    this._http.post( url, body ,{headers:this.httpHeaders}).subscribe( {
      next:(result)=>{
        console.log("el resultado de insertar el criterio");
        console.log(result);
        const resp:any = result;

        if (resp.status == "success")
        {
          this._snack.open("Se agrego el criterio a la actividad", "Cerrar");
          console.log("si mando a cerrar el dialogo sería", this.dialogService.getRef()?.componentInstance );
          this.dialogService.closeDialog();
          this._actCriteriaService.setIsClose();
        }
        else {
          this._snack.open("No se pudo agregar el criterio", "Cerrar");
        }


      },
      error:(error)=>{
        console.log("Sucedio un error");
        console.log(error);
      }

    })
  }// fin guardar criterio
}

