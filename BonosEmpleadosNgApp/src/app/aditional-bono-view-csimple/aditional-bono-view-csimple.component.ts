import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BACKSERVER } from '../app.module';
import { HttpClient } from '@angular/common/http';
import { DocumentViewBonosViewService } from '../document-view-bonos-view.service';

@Component({
  selector: 'app-aditional-bono-view-csimple',
  templateUrl: './aditional-bono-view-csimple.component.html',
  styleUrls: ['./aditional-bono-view-csimple.component.sass']
})
export class AditionalBonoViewCSimpleComponent {
  aditionals: any;
  authAdBoCr: any[] = [];
  employeeId: any;
  selectedMonth: any;
  aditionalsSaved: any;
  constructor(private _snack:MatSnackBar,
              private _http:HttpClient,
              private dcbvs:DocumentViewBonosViewService)
  {
    this.dcbvs.emitter.subscribe((event)=>{
      if(event.name == 'transfer'){
        this.employeeId = event.data.queryData.employeeId;
        this.selectedMonth = event.data.queryData.month;
        this.aditionals = event.data.aditionals;
        this.aditionalsSaved = event.data.queryData.aditionalsEvaluated;
        this.searchBonusEvaluation();
      }
    })

  }

  searchBonusEvaluation(){
    this.aditionals.forEach((bonus:any, index:number)=>{
      this.aditionalsSaved.forEach((bonusEvaluated:any)=>{
        if(bonus.adBonoId === bonusEvaluated.adId){
          this.aditionals[index].evaluation = bonusEvaluated;
        }
      })
    });

    this.aditionals
  }


  saveABCriteria() {
    if (this.authAdBoCr == undefined) {
      this._snack.open('debes seleccionar una opción en la autorización', 'cerrar', { duration: 5000 });
      return;
    }

    const url = BACKSERVER + '/adBonoCriteria';
    this._http.post(url, { adBonodata: this.aditionals, auth: this.authAdBoCr, employeeID: this.employeeId, month: this.selectedMonth }).subscribe({
      next: (res: any) => {
        console.log('next', res);
        if (res.status == 'success') {
          this._snack.open('Se guardaron los datos de la evaluación', 'Cerrar', { duration: 3000 })
        }
        else {

          this._snack.open('Sucedio un error al guardar los datos de la evaluación:' + res.message, 'Cerrar', { duration: 3000 })
        }

      }
    })

  }

  changes(value: any) {
    console.log('el valor que se intenta agregar es ', value);
    console.log(this.authAdBoCr);
  }

}
