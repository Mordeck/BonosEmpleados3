import { Component, OnInit } from '@angular/core';
import { SalesAditionalsBonusService } from '../sales-aditionals-bonus.service';
import { HttpClient } from '@angular/common/http';
import { BACKSERVER } from '../app.module';
import { Subject } from 'rxjs';
import { CustomNumberFormatPipe } from '../MexicanCurrentPipe';

@Component({
  selector: 'app-sales-aditionals-bonus',
  templateUrl: './sales-aditionals-bonus.component.html',
  styleUrls: ['./sales-aditionals-bonus.component.sass']
})

export class SalesAditionalsBonusComponent implements OnInit {

  queryParams: any;

  salesBonus: any;

  auth: any;

  globalSales: any;

  indicator = new Subject()


  constructor(private sabs: SalesAditionalsBonusService,
    private http: HttpClient, private mxCurrency: CustomNumberFormatPipe) {

    sabs.getTranferer().subscribe({
      next: (data) => {
        this.queryParams = data;
        this.getSalesBonus()

      },
      error: (e: any) => {
        console.log('erro al recibir los parametros de consulta', e);

      },
      complete: () => {
        console.log('No se ubtuvieron los parametros de consulta');

      }
    })
  }


  ngOnInit(): void {
    this.sabs.indicator.next(true);
  }

  getSalesBonus() {
    const url = BACKSERVER + '/salesBonus'
    this.http.get(url, { params: this.queryParams })
      .subscribe({
        next: (r: any) => {

          this.salesBonus = r.data;
          this.getGlobalSales();

        }
      })
  }

  getGlobalSales() {
    const url = BACKSERVER + '/globalSales'
    this.http.get(url, { params: this.queryParams })
      .subscribe({
        next: (r: any) => {
          this.globalSales = r.data;
          this.calcProfit();
        }
      })
  }

  //calculamos la comision
  calcProfit(){
    this.salesBonus.forEach((e:any)=>{
      e.profit ='$ ' + this.mxCurrency.transform( ( e.percentage * this.globalSales.monthTotalSales) / 100 );
    })
  }

}
