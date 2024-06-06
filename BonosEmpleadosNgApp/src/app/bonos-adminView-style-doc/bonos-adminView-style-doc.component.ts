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
import { SalesAditionalsBonusService } from '../sales-aditionals-bonus.service';
import { LoginComponent } from '../login/login.component';
import { DocViewConditionViewService } from '../doc-view-condition-view.service';

@Component({
  selector: 'app-bonos-view-style-doc',
  templateUrl: './bonos-adminView-style-doc.component.html',
  styleUrls: ['./bonos-adminView-style-doc.component.sass'],
  animations: [fadeInOut],
  providers: [CustomNumberFormatPipe]
})
export class BonosAdminViewStyleDocComponent implements OnChanges {
  sAverage: string = '';
  conditions: any;

  cambio() {
    console.log('authBonoDocument');
    console.log(this.authBonoDocument)
    console.log(!this.authBonoDocument);

  }
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

  // variables para el formulario de ventas
  monthSales: number = 0;
  monthSalesGoal = 0;
  formattedMonthSales: string | null;
  formattedMonthSalesGoal: string | null;
  cumulatedSales = 0;
  cumulatedSalesGoal = 0;
  formattedCumulatedSales: string | null;
  formattedCumulatedSalesGoal: string | null;

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
  authAdBoCr: any[] = [];

  userData: any;
  documentData: any;
  evaluatedUser: any;
  authBAbud: any;
  authBonoDocument: any;
  amountBonoDoc = 0;

  constructor(private _http: HttpClient,
              private _snack: MatSnackBar,
              private _dialog: MatDialog,
              private currencyPipe: CurrencyPipe,
              private mxCurrencyPipe: CustomNumberFormatPipe,
              private documentServ: DocumentService,
              private sabs: SalesAditionalsBonusService,
              private dvcvs: DocViewConditionViewService ) {
    this.getDocuments();
    this.formattedMonthSales = this.currencyPipe.transform(this.monthSales, 'MXN', 'symbol', '1.2-2');
    this.formattedCumulatedSales = this.currencyPipe.transform(this.cumulatedSales, 'MXN', 'symbol', '1.2-2');
    this.formattedMonthSalesGoal = this.currencyPipe.transform(this.monthSalesGoal, 'MXN', 'symbol', '1.2-2');
    this.formattedCumulatedSalesGoal = this.currencyPipe.transform(this.cumulatedSalesGoal, 'MXN', 'symbol', '1.2-2');

    this.formattedMonthExpend = this.currencyPipe.transform(this.monthExpend, 'MXN', 'symbol', '1.2-2');
    this.formattedMonthExpendGoal = this.currencyPipe.transform(this.monthExpendGoal, 'MXN', 'symbol', '1.2-2');
    this.formattedCumulatedExpend = this.currencyPipe.transform(this.cumulatedExpend, 'MXN', 'symbol', '1.2-2');
    this.formattedCumulatedExpendGoal = this.currencyPipe.transform(this.cumulatedExpendGoal, 'MXN', 'symbol', '1.2-2');

    const userDataStr = localStorage.getItem('userData');

    if (userDataStr) {
      this.userData = JSON.parse(userDataStr);
    }


    console.log('//esperamos a que esten listos para recibir los parametros de consulta');

    sabs.salesAditionalIsReady().subscribe({next:(r:any)=>{
      console.log(" //envio los datos para consulta de bonos adicionales para bonos por venta");
      this.sabs.sendQueryParams({ documentId: this.selectedDocId, month: this.selectedMonth, employeeId: this.employeeId })
    }})

  }




  saveSales() {

    const body = {
      documentId: this.selectedDocId,
      employeeId: this.employeeId,
      monthEvaluated: this.evalFound[0].monthToEvaluate,
      monthSales: this.monthSales,
      cumulatedSales: this.cumulatedSales,
      salesGoal: this.monthSalesGoal,
      cumulatedSalesGoal: this.cumulatedSalesGoal
    }

    this._http.post(BACKSERVER + '/saveSales', { body: body }).subscribe(
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

  saveBudget() {
    const body = {
      documentId: this.selectedDocId,
      employeeId: this.employeeId,
      monthEvaluated: this.evalFound[0].monthToEvaluate,
      monthExpend: this.monthExpend,
      cumulatedExpend: this.cumulatedExpend,
      expendGoal: this.monthExpendGoal,
      cumulatedExpendGoal: this.cumulatedExpendGoal
    }

    this._http.post(BACKSERVER + '/saveExpenses', { body: body }).subscribe(
      {
        next: (res: any) => {
          if (res.status == 'success') {
            this._snack.open('Se agregaron los gastos', 'Cerrar', { duration: 3000 })
          }
          else {
            this._snack.open('No se pudieron agregar los gastos: \n ' + res.message, 'Cerrar', { duration: 5000 })
          }
        }
      }
    )

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes');
    console.log(changes);

  }

  formatter(value: number) {
    this.formattedMonthSales = this.currencyPipe.transform(this.monthSales, 'MXN', 'symbol', '1.2-2');
    this.formattedCumulatedSales = this.currencyPipe.transform(this.cumulatedSales, 'MXN', 'symbol', '1.2-2');
    this.formattedMonthSalesGoal = this.currencyPipe.transform(this.monthSalesGoal, 'MXN', 'symbol', '1.2-2');
    this.formattedCumulatedSalesGoal = this.currencyPipe.transform(this.cumulatedSalesGoal, 'MXN', 'symbol', '1.2-2');

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
      calificaciones: this.optionSelected
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

    this.updateAverage()

  }

  updateAverage() {
    console.log('Actualizando el promedio');

    this.average = 0;

    this.optionSelected.forEach((e) => {
      //this.average += parseFloat(e.weighting);
      //this.sAverage = this.average.toString(2);
    })

    this.average = this.average / this.docStruc.activities.length;

    this.docStruc.average = this.average;

    console.log(this.average);
  }

  saveABbudget() {

  }

  getAverage() {
    let sumarized = 0;
    let cantElement = 0;

    this.evalFound.forEach((e: any) => {
      cantElement++;
      sumarized += e.weighting;
    })

    return sumarized / cantElement
  }

  //validacion para el empleado
  fullDataForm():boolean{
    if (this.selectedDocId == undefined) {
      this._snack.open('Selecciona un documento', 'Cerrar', { duration: 3000 });
      return false;
    }

    if (this.selectedMonth == undefined) {
      this._snack.open('Selecciona un Mes', 'Cerrar', { duration: 3000 });
      return false;
    }

    if (this.employeeId == undefined) {
      this._snack.open('Introduce un empleado', 'Cerrar', { duration: 3000 });
      return false;
    }
    return true;
  }

  // revisa si alguna de las actividades necesita presentar los promedios
  relacionPromedioCalificacion()
  {
    this.evalFound;
    this.docStruc;
  }

  consultar() {
    //console.log('consultando con los siguientes parametros', `\nDocId: ${this.selectedDocId} \nMes: ${this.selectedMonth} \nEmpleado: ${this.employeeId}`);

    //no realizamos la consulta si es que falta un dato
    if (!this.fullDataForm())
    return;

    this._http.get(BACKSERVER + '/evalQuery', { params: { docId: this.selectedDocId, month: this.selectedMonth, employeeId: this.employeeId } })
      .subscribe({
        next: (result: any) => {

          if (result.status == 'success') {
            //console.log(result.data);
            this.evalFound = result.data;
            this.average = this.getAverage();
            this.sAverage = this.average.toFixed(2);
            this.bonoVta = result.bonoVta;
            this.bonoBud = result.bonoBud;
            this.aditionals = result.aditionals;
            this.documentData = result.documentData;
            this.documentServ.sendDocument({ document:this.documentData, month:this.selectedMonth });
            this.evaluatedUser = result.evaluatedUser;
            this.conditions = result.conditions;
            this.dvcvs.emitter.emit( { type:'transfers', data:this.conditions,conditionsSaved:result.conditionsSaved, bonoDocument:result.bonoDocument });
            this.percentage = result.percentage;

            this.createStrucDoc();
            this.relacionPromedioCalificacion();

          }

          else {
            this._snack.open('No se encontraron evaluaciones pendientes con esos datos', 'Cerrar', { duration: 5000 });
            console.log('No se encontraron evaluaciones ');

          }

        }, error: (e) => {
          console.log('error al consultar el documento', e);

        }
      })

  }

  saveAdtionalBoonoData() {

    console.log({ auth: this.auth });

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
        console.log('sucedio un error al guardar la autorización', error);

      }
    })
  }

  getDocuments() {
    const url = BACKSERVER + '/documentByEvaluator';
    this._http.get(url)
      .subscribe({
        next: (result: any) => {
          if (result.status == 'success') {
            let data: any;

            if (result.data[1]) {
              data = [...result.data[0], ...result.data[1]]

            }
            else {
              this.documents = result.data[0];
            }
          }
        }, error: (e) => {
          console.log('sucedio un error al solicitar los documentos\n', e);

        }
      })
  }

  docStruc: any;

  createStrucDoc() {
    if (this.evalFound == undefined || this.evalFound.length == 0) {
      console.log('No se puede generar la estructura por que no hay evaluaciones');
      return;

    }

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

  saveDocBono() {
    const documentId = this.documentData.documentId
    const employeeId = this.evaluatedUser.employeeID;
    const monthEvaluated = this.evalFound[0].monthToEvaluate
    const average = this.average;
    const authorized = this.authBonoDocument;
    const amounth = this.amountBonoDoc;

    const url = BACKSERVER + '/addBonoAuth';

    if (!this.authBonoDocument){
      this._snack.open('Debes Seleccionar "Si" o "No"');
      return;
    }

    this._http.post(url, {documentId,employeeId,monthEvaluated,average,authorized,amounth}).subscribe({
      next:(r:any)=>{
        if( r.status == 'success' )
        {
          this._snack.open('Se agrego el bono', 'Cerrar', {duration:3000});
        }
        else
        {
          this._snack.open('No se pudo agregar el bono: ' + r.message, 'Cerrar', {duration:3000});
        }
      },
      error:(e)=>{
        console.log( 'Error en la petición', e );
      }
    })
  }

}
