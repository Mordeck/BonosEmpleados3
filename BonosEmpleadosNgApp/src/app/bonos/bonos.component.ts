import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BACKSERVER } from '../app.module';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EvaluationComponent } from '../evaluation/evaluation.component';
import { EvaluationService } from '../evaluation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SpinnerComponent } from '../spinner/spinner.component';
import { MatDialogService } from '../mat-dialog.service';
import { BonosService } from '../bonos.service';
import { EvaluationsCompletedComponent } from '../evaluations-completed/evaluations-completed.component';
import { EvaluationsCompletedService } from '../evaluations-completed.service';
import { fadeInOut } from '../animations/animations';

interface EvaluationInterface
{

}

class Evaluation extends MatTableDataSource<EvaluationInterface> {

}

@Component({
  selector: 'app-bonos',
  templateUrl: './bonos.component.html',
  styleUrls: ['./bonos.component.sass'],
  animations:[fadeInOut]
})

export class BonosComponent implements AfterViewInit, OnInit
{

  @ViewChild(MatSort) sort: MatSort | null = null;
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  evaluationsDataSource = new Evaluation([]);

  displayedColumns =  [ 'evalId','actId', "nomenclature", "docId","actDesc", "employeeName", "employeeId", "evaluado","evaluador","evalMonth", "finishdate", "department", ];
  httpHeaders: HttpHeaders;
  evaluations: any;
  currentMonth: any | null;

  //si ya se completo la actividad del mes actual
  currMonCompltd =  false;
  searchText: any;

  userData:any;

  constructor(private _http:HttpClient,
              private pipe:DatePipe,
              private _dialog:MatDialog,
              private _evalService:EvaluationService,
              private _snack:MatSnackBar,
              private _mtDialogService:MatDialogService,
              private _bonoService: BonosService,
              private _evalCompSer:EvaluationsCompletedService)
  {


    const token = localStorage.getItem("token") || "";
    this.httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.currentMonth = this.pipe.transform(new Date() , 'MMMM yyyy', 'es');
    this.currentMonth = ( this.currentMonth?.split('')[0].toUpperCase() || 'error' ) +  this.currentMonth?.substring(1);
    this.getEvaluactions();

    this.evaluations = null;

    this._bonoService.getCloser().subscribe({
      next:()=>{
        this.getEvaluactions();
      }
    })




  }//constructor ends


  ngOnInit(): void {
    const data = localStorage.getItem('userData') || null
    this.userData = JSON.parse ( data || '' )
  }

  ngAfterViewInit(): void {

  }

  getSchedule()
  {
    const url = BACKSERVER + '/schedule'
    this._http.get(url, {headers:this.httpHeaders})
  }


  onHover(row: any) {

  }

  applyFilter()
  {
    this.evaluationsDataSource.filter = this.searchText.trim().toLowerCase();
  }


  wordMonth(month:string|null)
  {
    month = this.pipe.transform(new Date (new Date().getTime() - (1000 * 60 * 60 * 24 * 30)  ) , 'MMMM yyyy', 'es');
    month = ( month?.split('')[0].toUpperCase() || 'error' ) +  month?.substring(1);
    return month;
  }

  clickVercalif(row:any)
  {
    const diaEvaComRef: MatDialogRef<EvaluationsCompletedComponent> = this._dialog.open(EvaluationsCompletedComponent);
    this._evalCompSer.sendEvalId(row.evalId);
  }

  // mes anterior
  currtMonth = (new Date().getMonth() ).toString().padStart(2,'0');

  monthsList:string[] = [this.currtMonth]



  // el mes 0 es diciembre
  humanReadableDate(date: string)
  {
    let month = date.split('-')[1].trim();

    switch(month)
    {
      case '0':
        month =  'Diciembre';
      break;
      case '1':
        month =  'Enero';
      break;
      case '2':
        month =  'Febrero';
      break;
      case '3':
        month =  'Marzo';
      break;
      case '4':
        month =  'Abril';
      break;
      case '5':
        month =  'Mayo';
      break;
      case '6':
        month =  'Junio';
      break;
      case '7':
        month =  'Julio';
      break;
      case '8':
        month =  'Agosto';
      break;
      case '9':
        month =  'Septiembre';
      break;
      case '10':
        month =  'Octubre';
      break;
      case '11':
        month =  'Noviembre';
      break;

    }
    return month  + ' - '+ date.split('-')[0];
  }


  private getEvaluactions()
  {
    const url  = BACKSERVER + '/evaluations';
    const year = new Date().getFullYear();
    const spinner = new SpinnerComponent();
    spinner.show = true;

    this._http.get( url )
    .subscribe({
      next:(result) => {
          spinner.show = false;

          const res:any = result;
          if ( res.status == "success" ){
            this.evaluationsDataSource.data = res.data ;
            this.evaluationsDataSource.sort = this.sort;
            this.evaluationsDataSource.paginator = this.paginator;
          }
        },

        error:(error) =>
        {
          spinner.show = false;
          console.log("sucedio un error al solicitar las evaluaciones");
          console.log(error);
        }
      });
  }

  requestEvaluations()
  {
    const url = BACKSERVER + '/createEvaluations';

    this._http.get(url).subscribe({next:(result:any)=>{

      const pre = result[0].preEvaluations + result[1].preEvaluations;
      const gen = result[0].generated + result[1].generated;

      this._snack.open(`Pre-evaluaciones: ${pre} Generadas: ${gen}`, 'Cerrar')

      console.log(result);
    },
    error:(error)=>{
      console.log(error);
    }
  });
  }

  //traera la actividades correspondientes y determinará si ya fueron evaluadas
  getActivitiesList()
  {

  }

  isCurrentMonthCompleted(activitid:number)
  {

  }

  clickOnRow(row:any)
  {
    console.log("has hecho click en el row");
    console.log(row);


  }

  clickEvaluar(row:any)
  {

    const url  = BACKSERVER + "/evalCriterias";
    console.log("el row contiene: ", row );

    const params = {  activityId: row.activityId,
                      evalid: row.evalId,
                      numPosEvaluated: row.numPosEvaluated };

    this._http.get(url, { params:params })
    .subscribe({
      next:(result)=>{
        const res:any = result;
        if (res.status == 'success')
        {
          const matRef:MatDialogRef<EvaluationComponent> = this._dialog.open(EvaluationComponent);
          this._mtDialogService.setDialogRef(matRef);
          this._evalService.setEvaluationData(res);
        }

        else
        {
          this._snack.open(`Error: No se encontraron criterios para evaluar de la actividad: ${ row.activityId }`, "Cerrar");
          setTimeout(()=>
          {
            this._snack.open(`Error: ${ res.message }`, "Cerrar");
          }, 2000)
        }
      },

      error:(error)=>{
        console.log("No se pudieron obtener los criterios para evaluar");
        console.log(error);
      }
    });
  }

}
