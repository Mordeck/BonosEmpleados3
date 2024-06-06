import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { BACKSERVER } from '../app.module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-deductions',
  templateUrl: './deductions.component.html',
  styleUrls: ['./deductions.component.sass']
})

export class DeductionsComponent implements AfterViewInit {
  deducDescrip = "";
  deducAmount: number = 0;
  documentData:any

  deductionsList:any[] = [];
  httpHeaders: any;

  constructor(private _http: HttpClient, private _snack:MatSnackBar)
  {
    const token = localStorage.getItem("token") || "";
    this.httpHeaders = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

  }

  ngAfterViewInit(): void
  {
    this.getDeductions();
  }

  getDeductions(){
    const url = BACKSERVER + '/deduction';
    this._http.get(url,{params:{ documentData:JSON.stringify(this.documentData) }, headers:this.httpHeaders }).subscribe({
      next:(result)=>{
        const res:any = result;
        console.log('al solicitar deducciones');

        console.log(res);
        if(res.status == 'success'){
          console.log('se obtuvieron deducciones');
          this.deductionsList = res.data;
        }

        else{
          console.log('no se obtuvieron deducciones');

        }
      }
    })
  }

  saveDeduction()
  {
    const url = BACKSERVER + '/deduction';
    this._http.post(url, { documentData:this.documentData, description:this.deducDescrip, amount:this.deducAmount }, { headers:this.httpHeaders }).subscribe({
      next:(result)=>{
        const res:any = result;
        if (res.status == 'success'){
          this.deductionsList = res.data;
          this._snack.open('Se agrego correctamente la deducción', 'Cerrar', { duration:3000 });
          this.getDeductions();

        }
        else{
          this._snack.open('Hubo un error al agregar la deducción', 'Cerrar', { duration:3000 });

        }
      }
    })

  }

}
