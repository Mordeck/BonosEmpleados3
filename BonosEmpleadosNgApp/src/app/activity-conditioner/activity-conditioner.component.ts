import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BACKSERVER } from '../app.module';

@Component({
  selector: 'app-activity-conditioner',
  templateUrl: './activity-conditioner.component.html',
  styleUrls: ['./activity-conditioner.component.sass']
})
export class ActivityConditionerComponent implements AfterViewInit
{
  documentdata:any;
  descrip = "";
  httpHeaders: any;
  criterios:any[] = [];
  criterio = '';

  condAdded = false;

  conditionId = 0;
  criValue = 0;


  constructor(private _http:HttpClient, private _snack: MatSnackBar)
  {
    const token = localStorage.getItem("token") || "";
    this.httpHeaders = new HttpHeaders({  'Authorization': `Bearer ${token}`  });



  }

  ngAfterViewInit(): void
  {
    const url = BACKSERVER +  '/condition';

    this._http.get(url, { headers: this.httpHeaders, params: { documentData: JSON.stringify( this.documentdata ) } }).subscribe({
      next:(result)=>{
        const res:any = result;
        console.log(result);

        if ( res.status == 'success')
        {
          this.conditionId = res.data[0].conditionId;
          this.descrip = res.data[0].description;
          this.condAdded = true;
          this.getCondCriterias();
        }

        else {

        }
      }
    });


  }

  addCondCriteria()
  {
    if (this.criterio.length < 10 )
    {
      this._snack.open('la descripción del criterio debe contener al menos 10 caractéres', 'Cerrar', {duration:5000});
      return;
    }

    //this.criterios.push( { description: this.criterio, value: this.criValue });
    //console.log(this.criterios);

    const url = BACKSERVER + '/conditionCriteria'

    const conditionId = this.conditionId;
    const value = this.criValue;

    this._http.post(url, { conditionId: conditionId,  criterio: this.criterio, value: value  } , { headers: this.httpHeaders }).subscribe({
      next:(result)=>{
        const res:any = result;
        if ( res.status == 'success')
        {
          this._snack.open('Se agregó el criterio correctamente','Cerrar', { duration: 3000 })
        }
        else {
          this._snack.open('Hubo un error al agregar el criterio','Cerrar', { duration: 3000 })
        }
      },

      error:(error)=>{
        console.log("hubo un error al solicitar la inseción");
        this._snack.open('Hubo un error al solicitar la inserción','Cerrar', { duration: 3000 })

      }
    });


    this.getCondCriterias();
  }

  getCondCriterias()
  {
    const url = BACKSERVER + '/conditionCriteria';
    this._http.get(url, { params: { conditionId:this.conditionId }, headers:this.httpHeaders }).subscribe({
      next:(result)=>{
        const res:any = result;
        if (res.status == "success"){
          this.criterios = res.data;
          this._snack.open('Se encontraron los criterios de la condición', 'Cerrar', {duration: 3000 });
          console.log(res.data)
        }

        else
        {

          this._snack.open('No se encontraron los criterios de la condición', 'Cerrar', {duration: 5000 })
        }

      },
      error:(error)=>{
        console.log("hubo un error al solicitar los criterios");

      }
    })  }

  addCondition()
  {
    console.log("agregando condicion al documento");
    console.log(this.documentdata);
    console.log("descripción");
    console.log(this.descrip);

    if (this.descrip.length < 31 )
    {
      this._snack.open('La descripción debe tener al menos 30 carácteres', "Cerrar", {duration:5000 });
      return;
    }

    const url = BACKSERVER + '/condition'

    console.log(this.httpHeaders);


    this._http.post(url, { documentData: this.documentdata, description: this.descrip }, { headers:this.httpHeaders }).subscribe({
      next: (result)=>{
        const res:any = result;

        console.log("el resultado de solicitar la inserción");
        console.log(res);


        if ( res.status == 'success' )
        {
          this.condAdded = true;
          this.conditionId = res.data.conditionId;
          this._snack.open(`la condición se agregó correctamente conditionId: ${res.data.conditionId}`, 'Cerrar', { duration:3000 })
        }

        else { this._snack.open('No se pudo agregar la condicion', 'Cerrar', { duration:5000 }); }
      },
      error:(error)=>{ console.log("error en la peticion ", error); }
    })

  }
}
