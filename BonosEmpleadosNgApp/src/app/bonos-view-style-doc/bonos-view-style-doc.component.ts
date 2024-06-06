import { HttpClient } from '@angular/common/http';
import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { BACKSERVER } from '../app.module';
import { fadeInOut } from '../animations/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmSaveEvalComponent } from '../confirm-save-eval/confirm-save-eval.component';
import { CurrencyPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { CustomNumberFormatPipe } from '../MexicanCurrentPipe';
import { DocumentService } from '../document.service';
import { EvalDocViewSalesFormService } from '../eval-doc-view-sales-form.service';
import { BonusViewDocExpensesFormService } from '../bonus-view-doc-expenses-form.service';
import { BonosViewCriteriaViewService } from '../bonos-view-criteria-view.service';
import { DocumentViewBonosViewService } from '../document-view-bonos-view.service';
import { DocViewConditionViewService } from '../doc-view-condition-view.service';
import { DocumentViewDeductionsViewService } from '../document-view-deductions-view.service';
import { EvalDocFinalAuthService } from '../eval-doc-final-auth.service';



@Component({
  selector: 'app-bonos-view-style-doc',
  templateUrl: './bonos-view-style-doc.component.html',
  styleUrls: ['./bonos-view-style-doc.component.sass'],
  animations: [fadeInOut],
  providers: [CustomNumberFormatPipe]
})


export class BonosViewStyleDocComponent  {

  evaluatorPosName = 'Puesto del evaluador';

  documents: any[] = [];
  months = [
    { name: 'Enero', number: 1 },
    { name: 'Febrero', number: 2 },
    { name: 'Marzo', number: 3 },
    { name: 'Abril', number: 4 },
    { name: 'Mayo', number: 5 },
    { name: 'Junio', number: 6 },
    { name: 'Julio', number: 7 },
    { name: 'Agosto', number: 8 },
    { name: 'Septiembre', number: 9 },
    { name: 'Octubre', number: 10 },
    { name: 'Noviembre', number: 11 },
    { name: 'Diciembre', number: 12 },
  ]

  selectedDocId: any;
  selectedMonth: any;
  employeeId: any;

  evalFound: any;

  selectedRadios: any[] = [];
  optionSelected: any[] = [];
  average: number = 0;
  dataSaved = false;


  //datos de los bonos adicionales
  bonoVta: any;
  bonoBud: any;

  //variables para el formulario de gastos
  monthExpend = 0; //gastos del mes
  formattedMonthExpend: string | null; //gastos del mes en formato MXN

  monthExpendGoal = 0; // meta gastos mes
  formattedMonthExpendGoal: string | null; //meta de gastos del mes en formato MXN

  cumulatedExpend = 0; // gastos acumulados
  formattedCumulatedExpend: string | null; //gastos acumulados en formato MXN

  cumulatedExpendGoal = 0; // meta de gasto acumulado
  formattedCumulatedExpendGoal: string | null; //la meta de gastos acumulados en formato MXN
  aditionals: any;

  sales: any;
  monthGoal: any;
  monthAchieve: any;
  accumulatedGoal: any;
  accumulatedAchieve: any;
  auth: any;
  percentage: any;

  userData: any;
  authBAbud: any;

  //determina si debe verse el formulario para capturar gastos
  needViewFormExpenses = false;
  evaluatedUser: any;

  needViewFormSales: unknown;
  documentData: any;
  initialData: any;
  constructor(private _http: HttpClient,
              private _snack: MatSnackBar,
              private _dialog: MatDialog,
              private currencyPipe: CurrencyPipe,
              private mxCurrencyPipe: CustomNumberFormatPipe,
              private documentServ: DocumentService,
              private edvsf:EvalDocViewSalesFormService,
              private bvdef: BonusViewDocExpensesFormService,
              private bvevs: BonosViewCriteriaViewService,
              private dcbvs:DocumentViewBonosViewService,
              private dvcvs: DocViewConditionViewService,
              private dvdvs:DocumentViewDeductionsViewService,
              private edfas:EvalDocFinalAuthService ) {
    this.getDocuments();

    this.formattedMonthExpend = this.currencyPipe.transform(this.monthExpend, 'MXN', 'symbol', '1.2-2');
    this.formattedMonthExpendGoal = this.currencyPipe.transform(this.monthExpendGoal, 'MXN', 'symbol', '1.2-2');
    this.formattedCumulatedExpend = this.currencyPipe.transform(this.cumulatedExpend, 'MXN', 'symbol', '1.2-2');
    this.formattedCumulatedExpendGoal = this.currencyPipe.transform(this.cumulatedExpendGoal, 'MXN', 'symbol', '1.2-2');

    const userDataStr = localStorage.getItem('userData');

    if (userDataStr) {
      this.userData = JSON.parse(userDataStr);
    }

    //activando el formulario de ventas
    this.edvsf.isReadyIndicator.asObservable().subscribe( { next:(ready:any)=>{
      //necesitamos ver el formulario para capturar ventas?
      this.edvsf.needViewIndicator.next({ documentId:this.selectedDocId,
        month:this.selectedMonth,
        employeeId: this.employeeId ,
        needViewFormSales:this.needViewFormSales,
        eventName:''})
    }})

    //activando formulario de gastos
    this.bvdef.readyIndicator.asObservable().subscribe({next:(r)=>{
      this.bvdef.transmitter.next({ documentId:this.selectedDocId,
        month:this.selectedMonth,
        employeeId: this.employeeId ,
        needViewFormSales:this.needViewFormSales,
        eventName:''})
    }})

  }//ends constructor


  /*
  saveABCriteria() {
    if (this.authAdBoCr == undefined) {
      this._snack.open('debes seleccionar una opción en la autorización', 'cerrar', { duration: 5000 });
      return;
    }

    const url = BACKSERVER + '/adBonoCriteria';
    this._http.post(url, { adBonodata: this.aditionals, auth: this.authAdBoCr, employeeID: this.employeeId, month: this.docStruc?.monthToEvaluate.substring(0, 7) || this.selectedMonth }).subscribe({
      next: (res: any) => {
        console.log('next', res);
        if (res.status == 'success') {
          this._snack.open('Se guardaron los datos de la evaluación', 'Cerrar', { duration: 3000 })
        }
        else {

          this._snack.open('Sucedio un error al guardar los datos de la evaluación', 'Cerrar', { duration: 3000 })
        }

      }
    })

  }*/

  formatter(value: number) {
    this.formattedMonthExpend = this.currencyPipe.transform(this.monthExpend, 'MXN', 'symbol', '1.2-2');
    this.formattedMonthExpendGoal = this.currencyPipe.transform(this.monthExpendGoal, 'MXN', 'symbol', '1.2-2');
    this.formattedCumulatedExpend = this.currencyPipe.transform(this.cumulatedExpend, 'MXN', 'symbol', '1.2-2');
    this.formattedCumulatedExpendGoal = this.currencyPipe.transform(this.cumulatedExpendGoal, 'MXN', 'symbol', '1.2-2');
  }


  guardarEvaluacion() {
    console.log("Guardando evaluación");

    const dialogConfirm: MatDialogRef<ConfirmSaveEvalComponent> = this._dialog.open(ConfirmSaveEvalComponent);

    dialogConfirm.componentInstance.transmitter({
      datosIniciales: this.docStruc,
      calificaciones: this.calificaciones
    });

    dialogConfirm.componentInstance.getJobDoneTransmitter().subscribe({
      next: (value) => {
        dialogConfirm.close();
        this.dataSaved = true;
      }
    })

  }

  modelChange(act: any, index: number, evalId: any) {
    console.log('cambio el model');
    console.log('Agregando los datos');

    //console.log({ act:act, evalId:evalId, typeCriteria:typeCriteria, weighting:weighting });

    this.optionSelected[index].actId = act;
    this.optionSelected[index].evalId = evalId;
    //this.optionSelected[index].typeCriteria = typeCriteria;
    //this.optionSelected[index].weighting = weighting;

    console.log(this.optionSelected);
  }


  updateAverage() {
    console.log('Actualizando el promedio');

    this.average = 0;

    this.optionSelected.forEach((e) => {
      this.average += parseFloat(e.weighting);
    })

    this.average = this.average / this.docStruc.activities.length;

    this.docStruc.average = this.average;

    console.log(this.average);


  }

  calificaciones:any = {};
  saveMarks(event:any)
  {
    console.log('recibiendo calificaciones');


    for (let mark in event.newMarks )
    {
      this.calificaciones[mark]=event.newMarks;;

    }

    console.log(this.calificaciones);
  }


  /**
   * los datos para el componente de condiciones, solo debe ser llamado en el callback de la consulta
   * @param result debe contener el resultado de la consulta
   */
  sendConditionData(result:any){
    this.dvcvs.emitter.emit( { type:'transfers',
                               data:result.conditions,
                               conditionsSaved:result.conditionsSaved,
                               bonoDocument:result.bonoDocument });
  }

  sendDeductionData(result:any)
  {
    this.dvdvs.emitter.emit({deductions:result.documentDeductions, queryData:{ documentId:this.selectedDocId, month:this.selectedMonth, employeeId: this.employeeId } });
  }

  /**
   * para enviar al componente de autorizaciones final del documento
   */
  sendDocumentFinalAuth(result:any){
    this.edfas.emitter.emit({queryData:{ documentId:this.selectedDocId,month:this.selectedMonth, employeeId: this.employeeId ,needViewFormSales:this.needViewFormSales}});
  }

  consultar() {

    this.dataSaved = false;

    const queryData = { documentId:this.selectedDocId,month:this.selectedMonth, employeeId: this.employeeId ,needViewFormSales:this.needViewFormSales}

    if (this.selectedDocId == undefined) {
      this._snack.open('Selecciona un documento', 'Cerrar', { duration: 3000 });
      return;
    }

    if (this.selectedMonth == undefined) {
      this._snack.open('Selecciona un Mes', 'Cerrar', { duration: 3000 });
      return;
    }

    if (this.employeeId == undefined) {
      this._snack.open('Introduce un empleado', 'Cerrar', { duration: 3000 });
      return;
    }


    this._http.get(BACKSERVER + '/evalQuery', { params: { docId: this.selectedDocId, month: this.selectedMonth, employeeId: this.employeeId } })
      .subscribe({
        next: (result: any) => {

          if (result.status == 'success') {
            this.evalFound = result.data;

            this.evaluatedUser = result.evaluatedUser;
            this.documentData = result.documentData;
            this.needViewFormSales = result.needViewFormSales;
            this.needViewFormExpenses = result.needViewFormExpenses;

            this.documentServ.sendDocument({ document:this.documentData, month:this.selectedMonth });

            //enviando los datos a los formularios
            this.edvsf.needViewIndicator.next({ documentId:this.selectedDocId,month:this.selectedMonth, employeeId: this.employeeId ,needViewFormSales:this.needViewFormSales});
            this.bvdef.transmitter.next({ documentId: this.selectedDocId, month:this.selectedMonth, employeeId: this.employeeId, needViewFormExpenses:this.needViewFormExpenses});
            this.bvevs.emitter.subscribe((e)=>{
              if(e=='ready'){
                console.log('enviando el empleado', this.employeeId);

                this.bvevs.emitter.emit( { eventName:'transfer', documentId: this.selectedDocId, month:this.selectedMonth, employeeId: this.employeeId, needViewFormExpenses:this.needViewFormExpenses })
              }
            })

            this.bonoVta = result.bonoVta;
            this.bonoBud = result.bonoBud;
            this.aditionals = result.aditionals;

            type Event = { name:string, data:any };
            //enviamos los datos al servicio correspondiente
            const bonoAditionalData:Event = { name:'transfer',
                                              data:{ aditionals:this.aditionals,
                                                     queryData:{ documentId:this.selectedDocId,
                                                                  month:this.selectedMonth,
                                                                  employeeId: this.employeeId ,
                                                                  needViewFormSales:this.needViewFormSales,
                                                                  aditionalsEvaluated:result.aditionalsEvaluated } } };

            this.sendConditionData(result);
            this.sendDeductionData(result);
            this.sendDocumentFinalAuth(result);

            this.dcbvs.emitter.emit(bonoAditionalData);

            this.sales = result.sales[0];
            this.percentage = result.percentage;

            if (this.sales != undefined) {

              this.monthGoal = this.mxCurrencyPipe.transform(this.sales.monthGoal);
              this.monthAchieve = this.mxCurrencyPipe.transform(this.sales.monthAchieve);
              this.accumulatedGoal = this.mxCurrencyPipe.transform(this.sales.accumulatedGoal);
              this.accumulatedAchieve = this.mxCurrencyPipe.transform(this.sales.accumulatedAchieve);
            }


            this.createStrucDoc();

          }

          else {
            this._snack.open('No se encontraron evaluaciones pendientes con esos datos', 'Cerrar', { duration: 5000 });

          }

        }, error: (e) => {

        }
      })

  }




  saveAdtionalBoonoData() {


    this.employeeId
    this.selectedDocId

    if (this.auth == undefined) {
      this._snack.open('Selecciona una opción para la autorización', 'Cerrar', { duration: 5000 });
      return;
    }
    this._http.post(BACKSERVER + '/saveAditionalBonos', { auth: this.auth, employeeId: this.employeeId, documentId: this.selectedDocId }).subscribe({
      next: (result: any) => {
        if (result.status == 'success') {
          this._snack.open('Se guardo la autorización', 'Cerrar', { duration: 5000 })
        }
        else {
          this._snack.open('No se pudo guardar la autorizción', 'Cerrar', { duration: 5000 })
        }
      }, error: (error) => {

      }
    })
  }

  getDocuments() {
    const url = BACKSERVER + '/documentByEvaluator';
    this._http.get(url)
      .subscribe({
        next: (result: any) => {
          if (result.status == 'success') {
            this.initialData = result;
            let data = [];
              data = [ ...result.simples,
                       ...result.amounts,
                       ...result.deductions,
                       ...result.aditionals,
                       ...result.finals ]
              this.documents = data;
          }
        }, error: (e) => {

        }
      })
  }

  docStruc: any;

  createStrucDoc() {
    if (this.evalFound == undefined || this.evalFound.length == 0) {
      console.log('No se puede generar la estructura por que no hay evaluaciones');
      return;

    }

    console.log('Creando la estructura con', this.evalFound);


    this.docStruc = {
      bonoType: this.evalFound[0].bonoType,
      docDepartment: this.evalFound[0].docDepartment,
      monthToEvaluate: this.evalFound[0].monthToEvaluate,
      nomenclature: this.evalFound[0].nomenclature,
      posname: this.evalFound[0].posName,
      name: this.evalFound[0].name,
      employeeId: this.evalFound[0].employeeId,
      posName: this.evalFound[0].posName,
      activities: [] as any[]
    }

    let lastActId = -1;

    //agregando las actividades sin repertirlas
    this.evalFound.forEach((element: any) => {

      //si ya estanos revisando uno distinto
      if (element.activityId != lastActId) {
        lastActId = element.activityId;
        this.docStruc.activities.push({ evalId: element.evalId, activityId: element.activityId, description: element.actDescription, criterias: [] as any[] })
      }
    });


    //agregando los criterios por actividad
    for (let i = 0; i < this.docStruc.activities.length; i++) {
      this.evalFound.forEach((element: any) => {
        let currActId = this.docStruc.activities[i].activityId;
        if (currActId == element.activityId) {

          // si el criterio no ha sido agregado ya
          if (!this.searchCriteria(element.criteriaId, this.docStruc.activities[i].criterias)) {
            this.docStruc.activities[i].criterias.push({
              criteriaId: element.criteriaId,
              description: element.cDescription,
              valor: element.weighting,
              typeCriteria: element.TypeCriteria
            });
          }
        }

      })
    }

    this.docStruc;

  }

  searchCriteria(criteriaId: number, criterias: any[]) {
    for (let i = 0; i < criterias.length; i++) {
      if (criteriaId == criterias[i].criteriaId) {
        return true;
      }
    }

    return false;
  }

}
