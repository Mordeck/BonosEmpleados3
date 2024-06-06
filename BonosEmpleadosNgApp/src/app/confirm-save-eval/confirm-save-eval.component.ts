import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { BACKSERVER } from '../app.module';
import { BonosComponent } from '../bonos/bonos.component';

@Component({
  selector: 'app-confirm-save-eval',
  templateUrl: './confirm-save-eval.component.html',
  styleUrls: ['./confirm-save-eval.component.sass']
})
export class ConfirmSaveEvalComponent {

  dataTransmition = new Subject();


  //observer que indicara cuando debe cerrarse el dialog
  jobDoneTransmitter = new Subject();

  evalData: any;

  parentComponent: any;


  constructor(private _snack: MatSnackBar, private _http: HttpClient)
  {
    this.getTransmitter().subscribe({next:(value:any) => {
      console.log('recibiendo los datos de la evaluacion', value);

      this.evalData = value;
    }})
  }

  getJobDoneTransmitter()
  {
    return this.jobDoneTransmitter.asObservable();
  }

  getTransmitter()
  {
    return this.dataTransmition.asObservable();
  }


  transmitter(value:any)
  {console.log('transmitiendo los datos de evaluacion');

    this.dataTransmition.next(value);
  }

  saveEval()
  {

    const cantActivities  = this.evalData.datosIniciales.activities.filter( (element:any) => element !== undefined);
    //const cantMarks  = this.evalData.calificaciones.filter( (element:any) => element !== undefined);

    console.log( 'se ha confirmado' );
    console.log( 'Guardando los datos' );
    console.log( "Cant Actividades: " , cantActivities.length );
    //console.log( "Cant Calificaiones: " , cantMarks.length );


    /*
    if ( cantActivities.length != cantMarks.length )    {
      this._snack.open('No se han calificado todas las actividades, favor de validar', 'Cerrar', {duration:5000});
      return;
    }
    */

    this._http.post(BACKSERVER + '/saveEval', { calificaciones: this.evalData.calificaciones }).subscribe(
      { next:(res:any)=>{
        console.log('Respuesta al solictar guardar las evaluciones');
        console.log(res);
        if (res.status == 'success')
        {
          this._snack.open('Se guardó la evaluación', 'Cerrar' , {duration:3000});
          this.jobDoneTransmitter.next(true);
        }
        else{

          this._snack.open('Error: No se pudo guardar la evaluación', 'Cerrar' , {duration:3000})
        }

      },

      error:(error)=> {
        console.log('sucedio un error', error);

      }
    }
    )

    console.log(this.evalData);

  }
}
