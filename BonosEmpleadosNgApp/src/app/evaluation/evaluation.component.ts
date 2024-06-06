import { Component } from '@angular/core';
import { EvaluationService } from '../evaluation.service';
import { fadeInOut } from '../animations/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BACKSERVER } from '../app.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogService } from '../mat-dialog.service';
import { BonosService } from '../bonos.service';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.sass'],
  animations: [fadeInOut]
})
export class EvaluationComponent {
  evaluationData: any = [];
  actCriterias: { activities: any } = { activities: [] };

  seleccion = "";
  httpHeaders: any;

  //tiendas
  lm = '0';
  urb = '0';
  qro = '0';
  pt = '0';
  fd = '0';
  ln = '0';
  ir = '0';
  pue = '0';
  average: number = 0;
  evalid:number = 0;


  constructor(private _evalService: EvaluationService,
            private _http: HttpClient,
            private _snack:MatSnackBar,
            private _mtDialogService:MatDialogService,
            private _bonosServ:BonosService) {
    this._evalService.getEvaluationData().subscribe({
      next: (data) => {
        const res:any = data
        this.evaluationData = res.data;
        this.evalid = res.evalId;
        this.criteriaInMonth(this.evaluationData)
        this.createActCriteriasStruct();
        console.log(this.actCriterias);

      },
      error: (error) => {
        console.log("No se pudieron tener los datos de evaluación", error);

      }
    });

  }//fin constructor



  guardaBono() {

    if (this.seleccion == '')
    {
      this._snack.open('No seleccionaste una calificación', 'Cerrar');
      return;
    }

    let criId = this.seleccion.split('check-')[1];
    let evalId = this.evalid;
    let criType;

    this.evaluationData.forEach((e:any)=>{
      if (e.criteriaId == criId)
      {
        criType = e.typeId;
      }
    });

    const body = { criteriaId:criId, evalId, typeId:criType, average:this.average }

    const token = localStorage.getItem("token") || "";

    this.httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });


    const url = BACKSERVER + "/addBono";


    this._http.post(url, body, { headers: this.httpHeaders }).
      subscribe({
        next: (result) => {
          console.log("el resultado es: ");
          console.log(result);
          const res:any = result;
          if (res.status == "success")
          {
            this._snack.open("Se ha guardado la evaluación correctamente", 'Cerrar', { duration:3000 });
            this._mtDialogService.closeDialog();
            this._bonosServ.setCloser()
          }

          else {

            this._snack.open("Hubo un error al guardar la evaluación");
          }

        },
        error: (error) => {
          console.log("hubo un error al guardar el bono");
          console.log(error);

        }
      })



  }

  /**calcula el promedio */
  calcAverage() {
    this.average = parseFloat(this.lm) + parseFloat(this.urb) + parseFloat(this.qro) + parseFloat(this.pt) + parseFloat(this.fd) + parseFloat(this.ln) + parseFloat(this.ir) + parseFloat(this.pue);
    console.log("la suma es ", this.average);

    this.average = this.average / 8;
    this.average = parseFloat( this.average.toFixed(2) ) ;
    if (isNaN(this.average))
    {
      this._snack.open('Uno o mas valores introducidos no es un valor decimal', 'Cerrar', {duration: 3000} )
    }
  }

  values: any = null;

  addStorePercent(storeId: any) {
    console.log("agregando un valor");
  }

  optionChange(criteriaId: string) {
    console.log(criteriaId);
    this.seleccion = criteriaId;
  };


  getNumericMonth(monthName: string) {
    switch (monthName) {
      case 'Enero':
        return 1;
      case 'Febrero':
        return 2;
      case 'Marzo':
        return 3;
      case 'Abril':
        return 4;
      case 'Mayo':
        return 5;
      case 'Junio':
        return 6;
      case 'Julio':
        return 7;
      case 'Agosto':
        return 8;
      case 'Septiembre':
        return 9;
      case 'Octubre':
        return 10;
      case 'Noviembre':
        return 11;
      case 'Diciembre':
        return 12;
      default:
        return -1; // Return -1 for an invalid month name
    }
  }

  //elimina los criterios que no deberian aparecer en el mes actual
  criteriaInMonth(criteria: any) {
    let newArr =
      criteria.filter((element: any, index: number) => {
        let months: string[] = [];
        let currtMonth = new Date().getMonth() + 1;


        // si el criterio tiene rango de meses
        if (element.critDesc.includes('-')) {
          //obtenemos los meses
          let desc = element.critDesc.split('-')[1];
          months = desc.split(',');


          let firstMonth = months[0];
          let secondMonth = months[1];

          let nfirstMonth = this.getNumericMonth(firstMonth);
          let nSecondMonth = this.getNumericMonth(secondMonth);

          if (currtMonth >= nfirstMonth && currtMonth <= nSecondMonth) {

          }

          else {
            return false
          }
        }
        return true;
      });

    this.evaluationData = newArr;
  }

  private createActCriteriasStruct() {
    console.log("\nlos datos de evaluación");
    console.log(this.evaluationData);

    for (let i = 0; i < this.evaluationData.length; i++) {
      let currentActId = this.evaluationData[i].activityId[0];

      //buscamos el id
      let index = this.searchActId(currentActId)

      //si el ID no ha sido agregado ya ( === -1)
      if (index === -1) {
        //lo agregamos
        this.actCriterias.activities.push(
          {
            activityId: this.evaluationData[i].activityId[0],
            actDecription: this.evaluationData[i].actDescription,
            criterias: [{
              criteriaId: this.evaluationData[i].criteriaId,
              critDesc: this.evaluationData[i].critDesc,
              weighting: this.evaluationData[i].weighting,
              criteriaType: this.evaluationData[i].typeId
            }]
          })

      }

      // si ya exite ese activity
      else {

        //adicionamos solamente el criterio
        this.actCriterias.activities[index]?.criterias.push(
          {
            criteriaId: this.evaluationData[i].criteriaId,
            critDesc: this.evaluationData[i].critDesc,
            weighting: this.evaluationData[i].weighting,
            criteriaType: this.evaluationData[i].typeId
          }
        );
      }


    }//end for

    console.log('la estructura de los activities es:');
    console.log(this.actCriterias);

  }

  //si busca entre el arreglo si ya se encuentra agregado
  private searchActId(id: any) {
    for (let i = 0; i < this.actCriterias.activities.length; i++) {
      if (this.actCriterias.activities[i].activityId === id) {
        return i;
      }
    }

    return -1;
  }


}
