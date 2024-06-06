import { Component, OnInit } from '@angular/core';
import { CustomNumberFormatPipe } from '../MexicanCurrentPipe';
import { BonosViewStyleDocComponent } from '../bonos-view-style-doc/bonos-view-style-doc.component';
import { BonusViewDocExpensesFormService } from '../bonus-view-doc-expenses-form.service';
import { BACKSERVER } from '../app.module';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-expenses-form',
  templateUrl: './expenses-form.component.html',
  styleUrls: ['./expenses-form.component.sass']
})
export class ExpensesFormComponent implements OnInit {

  //gastos meta mensuales
  cumulatedExpendGoal: any;
  formattedCumulatedExpendGoal: any;

  monthExpendGoal: any;
  formattedMonthExpendGoal: any;

  //gastos reales
  monthExpend: any;
  formattedMonthExpend: any;

  cumulatedExpend: any;
  formattedCumulatedExpend: any;

  queryParams:any;


  needViewFormExpenses: any;
  constructor(private currencyPipe: CustomNumberFormatPipe,
              private bvdef: BonusViewDocExpensesFormService,
              private _http:HttpClient,
              private _snack:MatSnackBar) {
      this.bvdef.transmitter.asObservable().subscribe({next:(r:any)=>{
        console.log('Se obtuvieron los parametros de consulta para los gastos ');
        this.queryParams = r;
        this.needViewFormExpenses = r.needViewFormExpenses;
        this.getAccumulatedExpens();
      }})
  }

  ngOnInit(): void {
    console.log('Listo para recibir los datos');
    this.bvdef.readyIndicator.next(true)
  }
  saveBudget() {
    const body = {
      documentId: this.queryParams.documentId,
      employeeId: this.queryParams.employeeId,
      monthEvaluated: this.queryParams.month,
      monthExpend: this.monthExpend,
      cumulatedExpend: this.cumulatedExpend,
      expendGoal: this.monthExpendGoal,
      cumulatedExpendGoal: this.cumulatedExpendGoal
    }

    this._http.post(BACKSERVER + '/saveExpenses', body ).subscribe(
      {
        next: (res: any) => {
          if (res.status == 'success') {
            this._snack.open('Se agregaron los gastos', 'Cerrar', { duration: 3000 })
          }
          else {
            this._snack.open('No se pudieron agregar los gastos: \n ' + res.message, 'Cerrar', { duration: 5000 })
          }
        },
        error:(e)=>{
          console.log('error al guardar los gastos');

        }
      }
    )

  }

  formatter() {
    this.formattedCumulatedExpendGoal = this.currencyPipe.transform(this.cumulatedExpendGoal);
    this.formattedMonthExpendGoal = this.currencyPipe.transform(this.monthExpendGoal);
    this.formattedMonthExpend = this.currencyPipe.transform(this.monthExpend);
    this.formattedCumulatedExpend = this.currencyPipe.transform(this.cumulatedExpend);
  }

  getAccumulatedExpens()
  {
    const url = BACKSERVER + '/accumulatedExpensByStore_Month';
    this._http.get(url, { params:{ documentId:this.queryParams.documentId, month:this.queryParams.month, employeeId:this.queryParams.employeeId }})
    .subscribe({next:(r:any)=>{
      if(r.status == 'success')
      {
        this.formattedCumulatedExpend ='$ ' +  this.currencyPipe.transform( r.data[0].cumulatedExpens );

      }
    }, error:(e)=>{
      console.log('Error al solicitar los gastos', e.error);
    }})
  }

}
