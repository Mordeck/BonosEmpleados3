import { Component, OnInit } from '@angular/core';
import { CustomNumberFormatPipe } from '../MexicanCurrentPipe';
import { BACKSERVER } from '../app.module';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EvalDocViewSalesFormService } from '../eval-doc-view-sales-form.service';

@Component({
  selector: 'app-sales-form',
  templateUrl: './sales-form.component.html',
  styleUrls: ['./sales-form.component.sass']
})
export class SalesFormComponent implements OnInit {

  // parametros de consulta
  documentId: any;
  employeeId: any;
  month: any;

  //inputs y presentacion de valor con formato
  monthSales: number = 0;
  monthSalesGoal = 0;
  formattedMonthSales = '';
  formattedMonthSalesGoal = '';
  cumulatedSales = 0;
  cumulatedSalesGoal = 0;
  formattedCumulatedSales = '';
  formattedCumulatedSalesGoal = '';

  //
  needViewFormSales = false;

  constructor(private currencyPipe: CustomNumberFormatPipe,
    private _http: HttpClient,
    private _snack: MatSnackBar,
    private edvsf: EvalDocViewSalesFormService) {

    this.edvsf.needViewIndicator.asObservable().subscribe({
      next: (queryParams: any) => {
        this.needViewFormSales = queryParams.needViewFormSales;
        this.documentId = queryParams.documentId;
        this.employeeId = queryParams.employeeId;
        this.month = queryParams.month;
        this.getAcumulatedSales()
      }
    })
  }

  ngOnInit(): void {
    this.edvsf.isReadyIndicator.next(true)
  }

  formatter() {
    this.formattedMonthSales = this.currencyPipe.transform(this.monthSales);
    this.formattedCumulatedSales = this.currencyPipe.transform(this.cumulatedSales);
    this.formattedMonthSalesGoal = this.currencyPipe.transform(this.monthSalesGoal);
    this.formattedCumulatedSalesGoal = this.currencyPipe.transform(this.cumulatedSalesGoal);
  }

  saveSales() {

    const body = {
      documentId: this.documentId,
      employeeId: this.employeeId,
      monthEvaluated: this.month,
      monthSales: this.monthSales,
      cumulatedSales: this.cumulatedSales,
      salesGoal: this.monthSalesGoal,
      cumulatedSalesGoal: this.cumulatedSalesGoal
    }

    this._http.post(BACKSERVER + '/saveSales', body).subscribe(
      {
        next: (res: any) => {
          if (res.status == 'success') {
            this._snack.open('Se agregaron las ventas', 'Cerrar', { duration: 3000 })
          }
          else {
            this._snack.open('No se pudieron agregar las ventas: \n ' + res.message, 'Cerrar', { duration: 5000 })
          }
        }
      }
    )
  }

  getAcumulatedSales() {
    const url = BACKSERVER + '/accumulatedSalesByStore_Month';
    this._http.get(url, { params: { month: this.month, employeeId: this.employeeId } }).subscribe({
      next: (r: any) => {
        if (r.status == 'success') {
          this.cumulatedSales = r.data[0].cumulatedSales;
          this.formatter();
        }
      },
      error:(e)=>{
      console.log('sucedio un error al solicitar las ventas acumuladas', e);

      }
    })
  }
}
