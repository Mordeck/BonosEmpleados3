import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input } from '@angular/core';
import { BACKSERVER } from '../app.module';
import { Subject } from 'rxjs';
import { DocumentService } from '../document.service';
import { CustomNumberFormatPipe } from '../MexicanCurrentPipe';
import { fadeInOut } from '../animations/animations';

@Component({
  selector: 'app-sales-and-budget',
  templateUrl: './sales-and-budget.component.html',
  styleUrls: ['./sales-and-budget.component.sass'],
  animations:[fadeInOut]
})
export class SalesAndBudgetComponent implements AfterViewInit
{


  documentData:any;
  monthNumber:any;

  //ventas meta
  monthSalesGoal: any;
  accumulatedSalesGoal: any;

  //ventas reales
  monthTotalSales:any
  accumulatedSales: any;
  monthGoalSales: any;
  totalCumullated: any;
  totalCumulatedGoal: any;


  //gastos
  monthTotalExpens: any;
  monthGoalExpens: any;
  totalCumullatedExpens: any;
  totalCumulatedGoalExpens: any;

  panelOpenState = false;

  salesDetail:any
  visibleSalesDetail = false;

  expensDetail:any
  visibleExpensDetail = false;

  constructor(private http: HttpClient, private documentServ: DocumentService, private mxCurrencyPipe: CustomNumberFormatPipe ){
    documentServ.getTransmitter().subscribe({next:(document:any)=>{
      this.documentData = document.document;
      this.monthNumber = document.month;
      this.getGlobalSales();
      this.getGlobalExpenses();
    }})
  }

  toggleSalesDetail() {
   this.visibleSalesDetail = !this.visibleSalesDetail;
  }
  toggleExpensDetail() {
   this.visibleExpensDetail = !this.visibleExpensDetail;
  }

    // ya consiguio las ventas
  alreadyHaveTheSales = false;


  getGlobalSales()
  {

    const url = BACKSERVER + '/globalSales';
    this.http.get(url, {params:{month:this.monthNumber}}).subscribe( { next:(r:any)=>{
      if (r.status == 'success'){

        this.monthTotalSales = r.data.monthTotalSales;
        this.monthTotalSales = '$ ' + this.mxCurrencyPipe.transform(this.monthTotalSales) + ' MXN';
        this.monthGoalSales = r.data.monthGoalSales;
        this.monthGoalSales = '$ ' + this.mxCurrencyPipe.transform(this.monthGoalSales) + ' MXN';
        this.totalCumullated = r.data.totalCumullated;
        this.totalCumullated = '$ ' + this.mxCurrencyPipe.transform(this.totalCumullated) + ' MXN';
        this.totalCumulatedGoal = r.data.totalCumulatedGoal;
        this.totalCumulatedGoal = '$ ' + this.mxCurrencyPipe.transform(this.totalCumulatedGoal) + ' MXN';

        this.salesDetail = r.detail;
        this.intToCurrency(this.salesDetail);

      }
      else {
        console.log('no se pudieron obtener las ventas');

      }
    },error:(e)=>{
      console.log('Error al solicitar las ventas');
    }})
  }

  intToCurrency(array:any){
    array.forEach( ( element:any ) => {
      element.monthAchieve = this.mxCurrencyPipe.transform(element.monthAchieve);
      element.monthGoal = this.mxCurrencyPipe.transform(element.monthGoal);
      element.accumulatedAchieve = this.mxCurrencyPipe.transform(element.accumulatedAchieve);
      element.accumulatedGoal = this.mxCurrencyPipe.transform(element.accumulatedGoal);
    });

  }

  getGlobalExpenses()
  {

    const url = BACKSERVER + '/globalExpenses';
    this.http.get(url, {params:{month:this.monthNumber}}).subscribe({next:(r:any)=>{
      if (r.status == 'success'){
        this.monthTotalExpens = r.data[0].monthTotalExpens;
        this.monthTotalExpens = '$ ' + this.mxCurrencyPipe.transform(this.monthTotalExpens) + ' MXN';
        this.monthGoalExpens = r.data[0].monthGoalExpens;
        this.monthGoalExpens = '$ ' + this.mxCurrencyPipe.transform(this.monthGoalExpens) + ' MXN';
        this.totalCumullatedExpens = r.data[0].totalCumullatedExpens;
        this.totalCumullatedExpens = '$ ' + this.mxCurrencyPipe.transform(this.totalCumullatedExpens) + ' MXN';
        this.totalCumulatedGoalExpens = r.data[0].totalCumulatedGoalExpens;
        this.totalCumulatedGoalExpens = '$ ' + this.mxCurrencyPipe.transform(this.totalCumulatedGoalExpens) + ' MXN';

        this.expensDetail = r.detail;
        this.intToCurrency(this.expensDetail);

      }
      else {
        console.log('no se pudieron obtener las ventas');

      }
    },
    error:(e)=>{
      console.log('succedio un error al obtener los gastos: ', e);
    }})

  }

  ngAfterViewInit(): void
  {
    console.log("datos del documento en 'sales and budget'");
    console.log(this.documentData);


  }


}
