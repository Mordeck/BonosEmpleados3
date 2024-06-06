import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { BACKSERVER } from '../app.module';
import { EvaluationsCompletedService } from '../evaluations-completed.service';

@Component({
  selector: 'app-evaluations-completed',
  templateUrl: './evaluations-completed.component.html',
  styleUrls: ['./evaluations-completed.component.sass']
})

export class EvaluationsCompletedComponent
{
  evalId:any;
  marks:any; // las calificaciones

  constructor(private _http:HttpClient, private _evalCompSer:EvaluationsCompletedService)
  {

    const token = localStorage.getItem("token") || "";

    this._evalCompSer.getEvalId().subscribe({
      next:(evalId)=>{
        this.evalId  = evalId;

        const url = BACKSERVER + '/criteriasCompleted'
        this._http.get(url, { params:{ evalId: this.evalId } } ).subscribe(
          {next:(result)=>{
            const res:any = result;
            if ( res.status  == "success" )
            {
              this.marks = res.data[0];
            }
            else {
              console.log("sucedio un error al obtener las calificaciones", res.message );

            }
          }}
        );

      }
    });
  }

}
