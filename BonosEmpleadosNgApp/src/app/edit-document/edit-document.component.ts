import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogService } from '../mat-dialog.service';
import { BACKSERVER } from '../app.module';

@Component({
  selector: 'app-edit-document',
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.sass']
})
export class EditDocumentComponent {

  docDepartment: any;
  departments: any;
  isTodosSelected: any;
  userPosition: any;
  positions: any;
  docTypes: any;
  dateRegister: any;
  nomenclature: any;
  docType: any;
  httpHeaders: HttpHeaders;

  documentId:any;

  constructor(private _http:HttpClient, private _snack: MatSnackBar, private _dialogService:MatDialogService)
  {
    const token = localStorage.getItem("token") || "";
    this.httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.getDepartments()
    this.getDocTypes();
  }

  getDepartments()
  {
    const url = BACKSERVER + "/departments";


    this._http.get(url,{headers:this.httpHeaders}).subscribe({
      next:result=>{
        console.log("solicitando los departamentos", result)
        this.departments = result;
      },

      error:error=>{
        console.log("Error al solicitar departamemtos", error);

      }
    })
  }

  getDocTypes()
  {
    console.log("solicitando los tipos de documentos");

    const url = BACKSERVER + '/docTypes';


    this._http.get(url, { headers: this.httpHeaders})
    .subscribe(
      { next:(result)=>{
        console.log("el resultado de solicitar los documentos");
        const res:any = result;
        if (res.status == 'success')
        {
          console.log("los tipos de documentos son:", res.data);
          this.docTypes = res.data;
        }

        else {
          console.log("no se encontraron los tipos de documentos:", res.data);

        }
      },

      error:(error)=>{
        console.log("sucedio un error al solicitar los documentos", error);

      }
  })
  }

  selectAllOptions()
  {

    this.userPosition = [...this.positions.data];
  }

  showPositonSelected() {
  console.log(this.userPosition)
  }

  sendUpdateDocument()
  {

    this.docDepartment;
    this.userPosition;
    this.nomenclature;
    this.docType;

    const documentData =
    {
      docDepartment: this.docDepartment,
      userPosition: this.userPosition,
      nomenclature:  this.nomenclature,
      docType: this.docType,
      documentId: this.documentId // el documento a actualizar
     }

     this._http.post( BACKSERVER + '/updateDocument', { documentData: documentData }).subscribe({
      next:( res:any )=>{
        if ( res.status == 'success' )
        {
          this._snack.open('Se actualizó el documento', 'Cerrar', { duration:5000 } );
        }
        else
        {
          this._snack.open('No se pudo actualizar el documento', 'Cerrar', { duration:5000 } );
        }
      }
     })

  }


  onDepartSelection( callback?: Function )
  {
    this.isTodosSelected = false;
    const url = BACKSERVER + "/positions";
    const token = localStorage.getItem("token") || "";
    this.httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let depart: any = this.docDepartment.trim();

    console.log("buscando los puestos del departamento", this.docDepartment);

    this._http.get(url,{headers:this.httpHeaders, params:{ department: depart }}).subscribe({
      next:result=>{
        console.log("solicitando las puestos", result)
        this.positions = result;
        console.log(this.positions);

        if ( callback ) callback();
      },

      error:error=>{
        console.log("Error al solicitar puestos", error);

      }
    })
  }



 getObjectPosition(id:any)
  {
      for (let i = 0; i < this.positions?.data.length; i++ )
    {
      if ( this.positions.data[i].positionID == id  )
      {
       this.userPosition = [ this.positions.data[i] ];
       break;
      }
    }
  }

  showSelection()
  {
    throw new Error('Method not implemented.');
  }

}
