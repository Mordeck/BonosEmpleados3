import { Component, OnInit } from '@angular/core';
import { BACKSERVER } from '../app.module';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirmbudget-bono',
  templateUrl: './confirmbudget-bono.component.html',
  styleUrls: ['./confirmbudget-bono.component.sass']
})
export class ConfirmbudgetBonoComponent {

  documentData: any;

  addedBonoEmitter  = new Subject();

  percent = 0;

  constructor(private _http:HttpClient, private _snack: MatSnackBar) {

  }

  getAddedBonoEmitter()
  {
    return this.addedBonoEmitter.asObservable();
  }

  addbudgetBono() {
    this._http.post( BACKSERVER + '/budgetBono', { documentData: this.documentData, percent: this.percent }).
    subscribe({next:(res:any)=>{
      if (res.status == 'success')
      {
        this._snack.open('Este documento solicitará que se agregen gastos', 'Cerrar', {duration:3000});
        this.addedBonoEmitter.next(true);
      }

      else
      {
        this._snack.open('no se pudo agregar el bono por presupuesto al documento', 'Cerrar', {duration:3000});

      }

    }})
  }
}
