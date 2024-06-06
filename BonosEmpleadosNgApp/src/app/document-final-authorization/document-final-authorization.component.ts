import { Component } from '@angular/core';
import { EvalDocFinalAuthService } from '../eval-doc-final-auth.service';
import { HttpClient } from '@angular/common/http';
import { BACKSERVER } from '../app.module';

@Component({
  selector: 'app-document-final-authorization',
  templateUrl: './document-final-authorization.component.html',
  styleUrls: ['./document-final-authorization.component.sass']
})
export class DocumentFinalAuthorizationComponent {
  queryData:any;
  finalAuth:any;
  evaluationSummary:any = {};
  Object = Object;
  constructor(private edfas:EvalDocFinalAuthService,
              private http:HttpClient){
    this.edfas.emitter.subscribe((event)=>{
      this.queryData = event.queryData;
      this.getDocFinalAuth();
      this.getEvaluationSummary();
    })
  }

  getDocFinalAuth(){
    const url = BACKSERVER + '/documentFinalAuth';
    const params = {employeeId:this.queryData.employeeId,
                    documentId:this.queryData.documentId,
                    month:this.queryData.month}
    this.http.get(url,{params:params}).subscribe({
      next:(r:any)=>{
        if(r.status == 'success')
        {
          this.finalAuth = r.DocumentFinalAuth;
        }
      }
    })
  }

  getEvaluationSummary(){
    const url = BACKSERVER + '/evaluationSummary';
    const params = {employeeId:this.queryData.employeeId,
      documentId:this.queryData.documentId,
      month:this.queryData.month};
      this.http.get(url,{params:params}).subscribe({
        next:(r:any)=>{
          if(r.status == 'success')
          {
            this.evaluationSummary.aditionals = r.aditionals;
            this.evaluationSummary.deductions = r.deductions;
            this.evaluationSummary.documentAverageData = r.documentAverageData;
          }
          else {
            console.log('error al obtener el resumen');
          }
        }, error:(error)=>{
          console.log('error al solicitar el resumen', error);


        }
      })
    }
}
