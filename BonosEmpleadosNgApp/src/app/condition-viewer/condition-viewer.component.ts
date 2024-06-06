import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { DocViewConditionViewService } from '../doc-view-condition-view.service';
import { CustomNumberFormatPipe } from '../MexicanCurrentPipe';
import { HttpClient } from '@angular/common/http';
import { BACKSERVER } from '../app.module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-condition-viewer',
  templateUrl: './condition-viewer.component.html',
  styleUrls: ['./condition-viewer.component.sass']
})
export class ConditionViewerComponent {
  conditions:any = [];
  bonoDocument: any;

  selectedOption:any;
  importe:any;
  strImporte: string = '0';
  conditionsSaved: any;


  constructor(private dvcvs: DocViewConditionViewService,
              private mxCurrency:CustomNumberFormatPipe,
              private http: HttpClient,
              private snack: MatSnackBar)
  {
    this.dvcvs.emitter.subscribe((event)=>{
      if ( event.type == 'transfers'){
        this.conditions = event.data;
        this.bonoDocument = event.bonoDocument;
        this.conditionsSaved = event.conditionsSaved;
        this.conditionsSaved.finalAmount = this.mxCurrency.transform(this.conditionsSaved.finalAmount);
        //this.relacionaCondicionConEvaluado();
      }
    })

  }

  relacionaCondicionConEvaluado()
  {
    this.conditionsSaved.forEach((evaluation:any)=>{
      if (evaluation.conditionId === this.conditions.condition.conditionId)
      {
        this.conditions.condition.evaluation = evaluation;
      }
    })
  }

  optionSelected()
  {
    const amount = this.bonoDocument.amounth;
    const percent = (this.selectedOption.weighting / 100);
    const importe = amount * percent;
    this.importe = importe;
    this.strImporte ='$' + this.mxCurrency.transform(importe)
  }

  dataSaved = false;
  saveCondData()
  {
    const url = BACKSERVER + '/saveActivityCondition'
    const body = {
      conditionId:this.conditions.condition.conditionId,
      finalAmount:this.importe,
      evalMonth:this.bonoDocument.monthEvaluated,
      employeeId:this.bonoDocument.employeeId,
      criteriaId:this.selectedOption.id,
    };
    this.http.post(url,body).subscribe({next:(r:any)=>{
      if (r.status == 'success'){
        this.dataSaved = true;
        this.snack.open('Se agrego la información', 'Cerrar', { duration:3000 });
      }
      else {
        this.snack.open('Hubo un problema al guardar la información', 'Cerrar', { duration:3000 });
      }
    },
    error:(e)=>{
      console.log('sucedio un error al solicitar guardar el bono', e);
    }})

  }

}
