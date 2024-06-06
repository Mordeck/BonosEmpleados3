import { Component} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BACKSERVER } from '../app.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogService } from '../mat-dialog.service';

@Component({
  selector: 'app-new-document-form',
  templateUrl: './new-document-form.component.html',
  styleUrls: ['./new-document-form.component.sass']
})
export class NewDocumentFormComponent {

  nomenclature = "";
  bonoType = "";
  months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
  ];

  //lista de departamentos
  departments: [] | any = [];
  positions: [] | any = [];
  typesBonos:any = []

  completed = "";
  userRegister = "";
  dateRegister = "";
  docDepartment = "";
  userPosition: any;
  httpHeaders: HttpHeaders = new HttpHeaders();
  docTypes = ['Un empleado', 'Dos empleados']
  docType =  'Un empleado';

  constructor(private _http:HttpClient, private _snack: MatSnackBar, private _dialogService:MatDialogService)
  {
    this.dateRegister = this.getToday();
    this.getDepartments()
    this.getDocTypes();
  }

  selectAllOptions() {
    this.userPosition = [...this.positions.data];
  }

  showPositonSelected()
  {
    console.log("se ha seleccionado ");

    console.log(this.userPosition)
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
          this.typesBonos = res.data;
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

  getToday()
  {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0'); // Obtiene el número del día y añade un cero si es menor que 10
    const month = String(date.getMonth()+1).padStart(2, '0'); // Obtiene el número del día y añade un cero si es menor que 10
    return `${day}/${month}/${date.getFullYear()}`;
  }

  getDepartments()
  {
    const url = BACKSERVER + "/departments";
    const token = localStorage.getItem("token") || "";
    this.httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

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


  onDocTypeSelection()
  {

  }

  isTodosSelected = false;

  onDepartSelection()
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
      },

      error:error=>{
        console.log("Error al solicitar puestos", error);

      }
    })
  }

  duplaPositions:any;

  onDuplaSelection()
  {
    if (this.duplaPositions.length > 2){
      this._snack.open('Solo deben ser dos puestos', 'Cerrar', {duration:5000})
    }

    console.log(this.duplaPositions);

  }

  onDuplaClick()
  {
    if (this.duplaPositions === undefined)
    {
      this._snack.open('Debes seleccionar un departamento', 'Cerrar', {duration:5000})
    }

  }

  sendNewDocument()
  {

    const noDataMessage = "Completa los datos del formulario";

    if ( this.nomenclature === "" )
    {
      this._snack.open(noDataMessage + " [ Nomenclatura ]", "Cerrar");
      return;
    }

    if (this.docDepartment === "")
    {
      this._snack.open(noDataMessage + " [ Departamento ]", "Cerrar");
      return;
    }

    if (this.bonoType === "")
    {
      this._snack.open(noDataMessage + " [ Tipo documento ]", "Cerrar");
      return;
    }

    if (this.docType == 'Dos empleados')
    {
      if ( this.duplaPositions == undefined  || this.duplaPositions.length == 1 ){
        this._snack.open('No se han seleccionado correctamente los dos puestos', 'Cerrar', {duration:5000});
        return;

      }

    }

    else // si el tipo de documento es 'Un empleado'
    {
      if (this.userPosition === "")
      {
        this._snack.open(noDataMessage + " [ Puesto ]", "Cerrar");
        return;
      }
    }



    const url = BACKSERVER + "/document";
    const token = localStorage.getItem("token") || "";
    this.httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });


    const dupla = this.duplaPositions;
    console.log('los datos de la dupla son ');
    console.log(dupla);
    console.log( typeof dupla);


    const body = { nomenclature:this.nomenclature,
                   department: this.docDepartment,
                   docType: this.docType,
                   bonoType: this.bonoType,
                   position: this.userPosition,
                   dupla: dupla || '' }

    console.log("Agregando un nuevo documento");

    this._http.post(url, body, { headers: this.httpHeaders} ).subscribe({
      next:result=>
      {
        console.log("La respuesta al insertar documento", result);
        const resp:any = result;

        if(resp.status === "success")
        {
          this._snack.open("Se agrego el documento", "Cerrar");
          this._dialogService.closeDialog();
        }

        else {
          this._snack.open("No se pudo agregar el documento", "Cerrar");
          this._dialogService.closeDialog();

        }
      },

      error:error=>{
        console.log("Error al insertar el nuevo documento", error);
        this._dialogService.closeDialog();
      }
    });


  }

  showSelection(){
    console.log("Mostrando la seleccion")
    console.log(this.bonoType)
  }
}
