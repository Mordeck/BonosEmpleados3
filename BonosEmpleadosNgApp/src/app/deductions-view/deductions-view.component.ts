import { Component } from '@angular/core';
import { DocumentViewDeductionsViewService } from '../document-view-deductions-view.service';
import { CustomNumberFormatPipe } from '../MexicanCurrentPipe';
import { HttpClient } from '@angular/common/http';
import { BACKSERVER } from '../app.module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-deductions-view',
  templateUrl: './deductions-view.component.html',
  styleUrls: ['./deductions-view.component.sass']
})
export class DeductionsViewComponent {
  deductions:any;
  deductionsAmount = 0;
  queryData:any;

  constructor(private dvdvs:DocumentViewDeductionsViewService,
              private mxCurrency: CustomNumberFormatPipe,
              private http:HttpClient,
              private snack:MatSnackBar)
  {
    this.dvdvs.emitter.subscribe((data:any)=>{
      this.deductions = data.deductions;
      this.queryData = data.queryData;
      this.deductions.forEach((deduction:any, index:number)=>{
        this.getEvaluatedDeductions(deduction.docDeductionId,(e:any)=>{
          this.deductions[index].evaluation = e;
        })
      })
    })
  }

  updateTotal(i:number){
    this.deductions[i].totalAmount = this.mxCurrency.transform(this.deductions[i].monetaryAmount * this.deductionsAmount);
  }

  saveDeduction(deduction:any, i:number)
  {
    const url = BACKSERVER + '/viewDeduction'
    const body = {
      docDeductionId:deduction.docDeductionId,
      totalAmount:this.deductions[i].totalAmount,
      employeeId:this.queryData.employeeId,
      evaluatedMonth:this.queryData.month
    }

    this.http.post(url,body).subscribe(
      {
        next:(r:any)=>{
          if (r.status == 'success')
          {
            this.snack.open('Se guardo la deducción', 'Cerrar', {duration:3000});
          }
          else
          {
            this.snack.open('No se pudo agregar la información de la deducción:' + r.message, 'Cerrar', {duration:3000});
          }
        }
      }
    )
  }

  getEvaluatedDeductions(docDeductionId:any,callback:any)
  {
    const url = BACKSERVER + '/viewDeduction'
    const params:any = { docDeductionId, month:this.queryData.month, employeeId:this.queryData.employeeId };
    this.http.get(url, {params:params}).subscribe({next:(r:any)=>{
      if (r.status == 'success'){
        callback(r.data)
      }
    }})
  }

}
