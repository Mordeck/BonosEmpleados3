import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BACKSERVER } from '../app.module';
import { BonosViewCriteriaViewService } from '../bonos-view-criteria-view.service';

@Component({
  selector: 'app-criteria-view-eval',
  templateUrl: './criteria-view-eval.component.html',
  styleUrls: ['./criteria-view-eval.component.sass']
})
export class CriteriaViewEvalComponent implements OnInit {

  @Input()criterios: any;
  @Input()activity: any;
  documentId = 0;
  @Output() sendMarks = new EventEmitter<any>();
  calificaciones:any = {};
  employeeId:any;

  //los promedios de productividad de cada tienda
  prmProd_LM = "0";
  prmProd_URB = "0";
  prmProd_PT = "0";
  prmProd_FD = "0";
  prmProd_QRO = "0";
  prmProd_LN = "0";
  prmProd_IR = "0";
  prmProd_PUE = "0";
  authInAverageSales:any;

  //los promedios de gastos de cada tienda
  prmExpens_LM = "0";
  prmExpens_URB = "0";
  prmExpens_PT = "0";
  prmExpens_FD = "0";
  prmExpens_QRO = "0";
  prmExpens_LN = "0";
  prmExpens_IR = "0";
  prmExpens_PUE = "0";
  selectedMonth: any;
  authInAverageExpens: any;
  month: any;

  constructor(private _http: HttpClient,
    private bvevs: BonosViewCriteriaViewService) {

    this.bvevs.emitter.subscribe((event: any) => {
      if (event.eventName === 'transfer') {
        this.selectedMonth = event.month;
        this.documentId = event.documentId;
        this.employeeId = event.employeeId;
        this.month = event.month;
        this.getPromProdStores();
        this.getPromExpensStores();
      }
    })

  }

  changeSalesAuth(criterio:any, evalId:any)
  {
    const body = {  documentId: this.documentId,
      employeeId:this.employeeId,
      month:this.month,
      average:this.globalAverage,
      authorized:this.authInAverageSales,
      criteriaId:criterio.criteriaId,
      evalId: evalId };
      console.log(this.activity);

      const url = BACKSERVER + '/evalCriteriaAverage'
      this._http.post(url,body).subscribe({next:(r:any)=>{
        if(r.status ==  'success'){
          console.log('se guardó la autorización');
        }else {
          console.log('No se pudo guardar la autorización');
        }
      },error:(e)=>{console.log('Sucedio un error en la peticion de guardar el promedio');
      }})


  }

  changeExpensAuth(criterio:any, evalId:any)
  { console.log("Cambio de autorizacion");
    console.log(criterio.criteriaId);


  const body = {  documentId: this.documentId,
    employeeId:this.employeeId,
    month:this.month,
    average:this.globalAverageExpenses,
    authorized:this.authInAverageExpens,
    criteriaId:criterio.criteriaId,
    evalId: evalId };
    console.log(this.activity);

    const url = BACKSERVER + '/evalCriteriaAverage'
    this._http.post(url,body).subscribe({next:(r:any)=>{
      if(r.status ==  'success'){
        console.log('se guardó la autorización');
      }else {
        console.log('No se pudo guardar la autorización');
      }
    }})

  }

  addMark(activity: any, criterio: any) {
    //console.log(activity);
    //console.log(criterio);

    this.calificaciones['ActivityId-' + activity.activityId] = { evalid: activity.evalId, criteriaId: criterio.criteriaId } ;

    console.log(this.calificaciones);

  }


  InputRadioChange(mark:any)
  {
    console.log('Input Reaccionando');
    //console.log(mark);

    const inputActivity = mark.inputId.split('_')[0];


    const allRadios = document.querySelectorAll('[id^="' + inputActivity + '"]');

    allRadios.forEach((element:any) => {
      if (element.id !== mark.inputId)
          element.checked = false;
    });

    this.calificaciones[inputActivity]=mark.mark;

    this.sendMarks.emit({'newMarks':this.calificaciones})

  }

  getActivityIdMark(activityId:any){
    return this.calificaciones['ActivityId-' + activityId]
  }

  ngOnInit(): void {
    this.bvevs.emitter.emit('ready');
  }

  getPromProdStores() {
    const url = BACKSERVER + '/PromProdStores';

    if (!this.selectedMonth){
      return;
    }

    this._http.get(url, { params: { date: this.selectedMonth } }).subscribe({
      next: (r: any) => {
        if (r.status == "success") {
          this.prmProd_URB = r.ProductivityAverages.Urban.average.toFixed(2);
          this.prmProd_LN = r.ProductivityAverages.Leon.average.toFixed(2);
          this.prmProd_IR = r.ProductivityAverages.Irapuato.average.toFixed(2);
          this.prmProd_LM = r.ProductivityAverages.Lopez.average.toFixed(2);
          this.prmProd_PT = r.ProductivityAverages.Patria.average.toFixed(2);
          this.prmProd_QRO = r.ProductivityAverages.Queretaro.average.toFixed(2);
          this.prmProd_PUE = r.ProductivityAverages.Puebla.average.toFixed(2);
          this.prmProd_FD = r.ProductivityAverages.Federalismo.average.toFixed(2);

          this.calcGlobalAverage();

        }
      },
      error: (error) => {
        console.log('hubo un error al solicitar los promedios de productividad', error);
      }
    })
  }

  getPromExpensStores() {

    const url = BACKSERVER + '/PromExpensStores';
    if (!this.selectedMonth){
      console.log('No se pueden solicitar los promedios de inventarios si no se establecio el mes');
      return;
    }

    this._http.get(url, { params: { date: this.selectedMonth } }).subscribe({
      next: (r: any) => {
        if (r.status == "success") {
          this.prmExpens_URB = r.ExpensesAverages.Urban.average.toFixed(2);
          this.prmExpens_LN = r.ExpensesAverages.Leon.average.toFixed(2);
          this.prmExpens_IR = r.ExpensesAverages.Irapuato.average.toFixed(2);
          this.prmExpens_LM = r.ExpensesAverages.Lopez.average.toFixed(2);
          this.prmExpens_PT = r.ExpensesAverages.Patria.average.toFixed(2);
          this.prmExpens_QRO = r.ExpensesAverages.Queretaro.average.toFixed(2);
          this.prmExpens_PUE = r.ExpensesAverages.Puebla.average.toFixed(2);
          this.prmExpens_FD = r.ExpensesAverages.Federalismo.average.toFixed(2);

          this.calcGlobalAverageExpenses();
        }
      },
      error: (error) => {
        console.log('hubo un error al solicitar los promedios de productividad', error);
      }
    })
  }

  //promedio de productividad todas las tiendas
  globalAverage = "0";
  calcGlobalAverage() {
    const sum = parseFloat(this.prmProd_FD) +
      parseFloat(this.prmProd_IR) +
      parseFloat(this.prmProd_LM) +
      parseFloat(this.prmProd_LN) +
      parseFloat(this.prmProd_PT) +
      parseFloat(this.prmProd_PUE) +
      parseFloat(this.prmProd_URB) +
      parseFloat(this.prmProd_QRO);
    this.globalAverage = (sum / 8).toFixed(2);
  }

  //promedio de gastos todas las tiendas
  globalAverageExpenses = "0";
  calcGlobalAverageExpenses() {
    const sum = parseFloat(this.prmExpens_FD) +
      parseFloat(this.prmExpens_IR) +
      parseFloat(this.prmExpens_LM) +
      parseFloat(this.prmExpens_LN) +
      parseFloat(this.prmExpens_PT) +
      parseFloat(this.prmExpens_PUE) +
      parseFloat(this.prmExpens_URB) +
      parseFloat(this.prmExpens_QRO);
    this.globalAverageExpenses = (sum / 8).toFixed(2);
  }

}
