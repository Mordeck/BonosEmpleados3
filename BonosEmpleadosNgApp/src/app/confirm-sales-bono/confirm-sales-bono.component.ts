import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BACKSERVER } from '../app.module';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirm-sales-bono',
  templateUrl: './confirm-sales-bono.component.html',
  styleUrls: ['./confirm-sales-bono.component.sass']
})
export class ConfirmSalesBonoComponent {

  documentData: any;

  percent = 0;

  addedBonoEmitter  = new Subject();

  constructor(private _http:HttpClient, private _snack: MatSnackBar) {

  }

  getAddedBonoEmitter()
  {
    return this.addedBonoEmitter.asObservable();
  }

  addSalesBono() {
    this._http.post( BACKSERVER + '/salesBono', { documentData: this.documentData, percent: this.percent }).
    subscribe({next:(res:any)=>{
      if (res.status == 'success')
      {
        this._snack.open('Se agrego un bono por ventas al documento', 'Cerrar', {duration:3000});
        this.addedBonoEmitter.next(true);
      }

      else
      {
        this._snack.open('no se pudo agregar el bono por ventas al documento', 'Cerrar', {duration:3000});

      }

    }})
  }
}


