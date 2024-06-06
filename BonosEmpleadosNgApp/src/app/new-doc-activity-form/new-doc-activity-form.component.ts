import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { BACKSERVER } from '../app.module';
import { MatDialogService } from '../mat-dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivitiesNFormService } from '../activities-n-form.service';


@Component({
  selector: 'app-new-doc-activity-form',
  templateUrl: './new-doc-activity-form.component.html',
  styleUrls: ['./new-doc-activity-form.component.sass']
})
export class NewDocActivityFormComponent {


  public documentID: number = 0;
  nomenclatura = "";
  actDescription: string = "";
  httpHeaders: any;
  inserted = false;
  actCriterio = "";
  activityOwner: any;
  puestos: any;
  selectPos: any;//puesto seleccionado
  searchText: any;
  puestosFiltered: any;

  /**
   * @description si el tipo es para dos empleados es necesario especificar en la nueva actividad a agregar
   */
  docType = "";
  first: any;
  second: any;

  constructor(private _http: HttpClient,
    private _dialogService: MatDialogService,
    private _snack: MatSnackBar,
    private actFormServ: ActivitiesNFormService) {

    const token = localStorage.getItem("token") || "";
    this.httpHeaders = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.getPuestos();
  }

    applyFilter() {
      const regexp = new RegExp(this.searchText.toLowerCase());
      this.puestosFiltered = this.puestos.filter((element:any)=>{
        element.posName
        return regexp.test(element.posName.toLowerCase())
      })
    }


  getPuestos() {
    const url = BACKSERVER + '/positions';
    this._http.get(url, { headers: this.httpHeaders }).subscribe(
      {
        next: (result) => {
          const res: any = result;
          if (res.status === "success") {
            console.log("Se obtuvieron los puestos siguientes:", res);

            this.puestos = res.data;
            this.puestosFiltered = this.puestos;
          }

          else {
            console.log("sucedio un error al solicitar los puestos");

          }
        }
      }
    )

  }

  saveActivity() {
    console.log("Guardando la actividad");

    const url = BACKSERVER + "/activity";
    const owner = this.activityOwner;
    let applyToPos = "" ;

    if (this.first)
    {
      applyToPos += this.docType.split(' y ')[0].trim();
    }

    if (this.second)
    {
      applyToPos += '-' + this.docType.split(' y ')[1].trim();
    }


    // si  es un documento del tipo 2
    this.docType = this.docType.trim();
    if (this.docType.length > 0 )
    {
      if ( this.first  == undefined && this.second  == undefined ){
        this._snack.open( 'Debes seleccionar al menos un puesto para esta activitidad', "Cerrar", { duration: 3000 });
        return;
      }
    }

    if ( this.actDescription.length < 30 )
    {
      this._snack.open('Debes agregar al menos 30 carácteres en la descripción', "Cerrar", {duration:3000 });
    }

    if ( !this.selectPos )
    {
      this._snack.open('Debes seleccionar a un evaluador', "Cerrar", {duration:3000 });
    }



    const body = { documentId: this.documentID, description: this.actDescription, evaluatedPosition: this.selectPos, applyToPos:applyToPos }

    this._http.post(url, body, { headers: this.httpHeaders }).subscribe({
      next: result => {
        console.log("el resultado de agregar la activity", result)
        const resp: any = result;
        if (resp.status == "success") {
          this.inserted = true;
          this._dialogService.closeDialog();
          this._snack.open("Se inserto la nueva actividad", "Cerrar")
          this.actFormServ.updateActivitiesTable();

        }
      },
      error: error => {
        console.log("error al agregar la descripcion", error);
      }
    });

  }


}
