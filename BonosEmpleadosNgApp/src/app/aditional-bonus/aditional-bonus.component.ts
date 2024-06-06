import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BACKSERVER } from '../app.module';
import { CommonDataService } from '../common-data.service';

@Component({
  selector: 'app-aditional-bonus',
  templateUrl: './aditional-bonus.component.html',
  styleUrls: ['./aditional-bonus.component.sass']
})

export class AditionalBonusComponent implements AfterViewInit {
  documentdata:any;
  description: string = "";
  monetaryAmount: any;
  httpHeaders: HttpHeaders;
  inserted = false;

  aditionalsBonus:any[] = [];
  positions : any[] = [];
  posEvalSelected: any;
  typeBonoAd: any;
  percentage: any;

  constructor(private _dialog: MatDialog, private _snack: MatSnackBar, private _http:HttpClient, private commonData:CommonDataService )
  {

    const token = localStorage.getItem("token") || "";
    this.httpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}` });


  }

  ngAfterViewInit(): void {
    this.getAditionalsBonus();

    this.commonData.getPositions(  {
      next:(result:any)=>{
        console.log('el resultado de solicitar los puestos desde CommonData');
        console.log(result);
        this.positions = result.data;
      }
    })
  }

  getAditionalsBonus()
  {
    const url = BACKSERVER + '/aditionalBono'
    const documentdata = JSON.stringify(this.documentdata);
    this._http.get(url, { params:{documentData: documentdata},headers:this.httpHeaders }).subscribe({
      next:(result)=>{
        const res:any = result;
        console.log(res);

        if ( res.status == 'success')
        {
          console.log("los bonos adicionales encontrados", res.data );

          this.aditionalsBonus = res.data;

        }
      }
    })
  }

  save()
  {
    if ( this.description.length < 15 )
    {
      this._snack.open('La descripción debe tener al menos 15 caractéres', 'Cerrar', { duration:5000 })
      return;
    }

    const url = BACKSERVER + '/aditionalBono'

    if ( !this.posEvalSelected )
    {
      this._snack.open('No has seleccionado al puesto evaluador', 'Cerrar', { duration:5000 })
      return;
    }


    this._http.post( url, { documentData:this.documentdata,
                            description: this.description,
                            posEvaluator: this.posEvalSelected,
                            amount: this.monetaryAmount,
                            type:this.typeBonoAd,
                            percentage: this.percentage
                            }
                            ).subscribe({
      next:(result)=>{
        const res:any = result;
        if (res.status == 'success'){
          this._snack.open('Se guardo correctamente el bono', "Cerrar", { duration: 5000 });
          this.inserted = true;
        }

        else {
          this._snack.open('Error al guardar el bono', "Cerrar", { duration: 5000 });

        }
      }
    })

  }
}
