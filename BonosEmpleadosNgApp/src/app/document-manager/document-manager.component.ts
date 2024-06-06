import { Component, OnInit, ViewChild } from '@angular/core';
import { Document } from '../DocumentDataSource';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewDocumentFormComponent } from '../new-document-form/new-document-form.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BACKSERVER } from '../app.module';
import { NewDocActivityFormComponent } from '../new-doc-activity-form/new-doc-activity-form.component';
import { MatDialogService } from '../mat-dialog.service';
import { DeleteDocumentConfirmComponent } from '../delete-document-confirm/delete-document-confirm.component';
import { CdkAccordion } from '@angular/cdk/accordion';
import { ActivitiesComponent } from '../activities/activities.component';
import { fadeInOut } from '../animations/animations';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { EditDocumentComponent } from '../edit-document/edit-document.component';
import { DeleteDocumentFormComponent } from '../delete-document-form/delete-document-form.component';
import { ActivityConditionerComponent } from '../activity-conditioner/activity-conditioner.component';
import { AditionalBonusComponent } from '../aditional-bonus/aditional-bonus.component';
import { DeductionsComponent } from '../deductions/deductions.component';


@Component({
  selector: 'app-document-manager',
  templateUrl: './document-manager.component.html',
  styleUrls: ['./document-manager.component.sass'],
  animations: [fadeInOut]
})

export class DocumentManagerComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort | null = null;
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  visible: boolean = true;

  documentDataSource: Document = new Document([]);
  displayedColumns: string[] = ['documentId', 'nomenclature', "documentType", "userRegister", "dateRegister", "department", "position", 'condition', 'aditionalBonus', 'deductions', 'SalesAndBudget',"actions"];
  httpHeaders: HttpHeaders = new HttpHeaders();
  expandedRows: Set<number> = new Set<number>();
  positionsNames: any;

  prod = {
    'background-color': 'rgba(255,30,0,.2)',
    'color': 'rgba(255,30,0,.2)'
  }

  seeDeductions(element:any)
  {
    const diaDeduc:MatDialogRef<DeductionsComponent> = this._dialog.open(DeductionsComponent);
    diaDeduc.componentInstance.documentData = element;
  }

  seeAditionalBonus(element:any)
  {
    const baRef: MatDialogRef<AditionalBonusComponent> = this._dialog.open(AditionalBonusComponent);
    baRef.componentInstance.documentdata = element;
    baRef.componentInstance.getAditionalsBonus();
  }

  seeCondition(element:any)
  {
    const acref: MatDialogRef<ActivityConditionerComponent> =  this._dialog.open(ActivityConditionerComponent);
    acref.componentInstance.documentdata = element;
  }

  // Función para manejar el evento de clic en la fila
  toggleRow(rowId: number) {
    console.log("haciendo toggle");
    console.log(this.expandedRows);


    if (this.expandedRows.has(rowId)) {
      this.expandedRows.delete(rowId);
    } else {
      this.expandedRows.add(rowId);
    }
  }

  constructor(private _router: Router, private _dialog: MatDialog, private _http: HttpClient, private _dialogService: MatDialogService) {
    this.loadDocuments();
  }

  delDoc(docTodel: any) {
    console.log("Abriendo la confirmacion de elimacion", docTodel);
    const delDocConfRef: MatDialogRef<DeleteDocumentConfirmComponent> = this._dialog.open(DeleteDocumentConfirmComponent);
    delDocConfRef.componentInstance.documentData = docTodel;
    this._dialogService.setDialogRef(delDocConfRef);
    delDocConfRef.afterClosed().subscribe({
      next: result => {
        this.loadDocuments();
      }
    })

  }

  loadDocuments()
  {
    const url = BACKSERVER + "/document";
    const token = localStorage.getItem("token") || "";
    this.httpHeaders = new HttpHeaders({       'Authorization': `Bearer ${token}`    });

    this._http.get(url, { headers: this.httpHeaders }).subscribe({
      next: result => {
        const data: any = result;
        console.log("los documentos obtenidos son: ", data.data);
        this.documentDataSource.data = data.data;
        this.setPosNamesInMulti(data.data)



        for (let i = 0; i < data.data.length; i++) {
          const positionsList = data.data[i].userPosition;

          this.positionsNames = [];

          this._http.get(BACKSERVER + '/positionsByIdList', { headers: this.httpHeaders, params: { positionsList: positionsList } }).subscribe({
            next: (result) => {
              //console.log("al pedir los puestos de los documentos");
              //console.log(result);

              const res: any = result;
              if (res.status == "success") {
                //console.log(res);
                data.data[i].posNames = res.data;
                this.documentDataSource.sort = this.sort;
                this.documentDataSource.paginator = this.paginator;
              }
              else {
                console.log("error");

              }
            }
          });

        }

      },

      error: error => {
        console.log("Ocurrio un error al obtener los documentos", error);

      }
    })
  }

  setPosNamesInMulti(documents: any) {
    const newArr =
      documents.map((element: any, index:number ) => {
        if (element.multiEmployee?.trim().length != 0)
        {
          this.getPositionsNames(element.multiEmployee?.trim(), index);
        }
        return element;
      });

      console.log('el nuevo arreglo es ');
      console.log(newArr);


  }

  addNewActivity(element: any) {
    console.log("agregando nueva actividad");
    const dialogActRef: MatDialogRef<NewDocActivityFormComponent> = this._dialog.open(NewDocActivityFormComponent);
    console.log(element)
    dialogActRef.componentInstance.documentID = element.documentId;
    dialogActRef.componentInstance.nomenclatura = element.nomenclature;
  }

  seeActivities(element: any) {
    const actRef: MatDialogRef<ActivitiesComponent> = this._dialog.open(ActivitiesComponent);
    actRef.componentInstance.documentData = element;
    console.log(element);

  }

  typeDialog = "";

  setTypeDialog(type: string) {
    this.typeDialog = type;
  }

  openDialog(element: any, event: Event) {
    const htmlElement = event.target as HTMLElement;
    console.log(htmlElement);

    console.log("el elemento es")
    console.log(htmlElement.tagName)

    const tag = htmlElement.tagName;

    //edicion del documento
    if (tag == 'I' || tag == 'SPAN') {
      console.log(this.typeDialog)
      if (this.typeDialog == 'edit') {
        this.editDocument(element)
      }

      if (this.typeDialog == 'delete') {
        this.openDeleteForm(element)
      }
    }

    if (tag == 'DIV' || tag == 'TD') {
      this.seeActivities(element)
    }

  }

  openDeleteForm(element:any)
  {
    const delFormRef:MatDialogRef<DeleteDocumentFormComponent> = this._dialog.open(DeleteDocumentFormComponent);
    delFormRef.componentInstance.documentData = element;


  }

  getPositionsNames(ids:any, index:number)
  {
    const url = BACKSERVER + '/positionsByIdList';

    this._http.get( url, { headers:this.httpHeaders,  params:{ positionsList:ids } } )
    .subscribe({
      next:(result)=>{
        const res: any = result;

        if ( res.status == 'success' )
        {
          console.log(this.documentDataSource.data[index].multiEmployee = res.data[0].posName + 'y ' + res.data[1].posName );
          return res.data;
        }
        return 'Error'
      },

      error:(error)=>{
        console.log('sucedio un error al solicitar los puestos');
        console.log(error);


      }

    })

  }

  ngOnInit(): void {
  }

  onHover(element: any) {
  }

  searchText: string = '';

  applyFilter() {
    this.documentDataSource.filter = this.searchText.trim().toLowerCase();
  }

  editDocument(element: any) {
    console.log("editando el documento");
    console.log(element);

    //utilizamos el mismo componente de "nuevo documento" para editar el documento
    const edref: MatDialogRef<EditDocumentComponent> = this._dialog.open(EditDocumentComponent);
    edref.componentInstance.nomenclature = element.nomenclature.trim();
    edref.componentInstance.docDepartment = element.docDepartment.trim();
    edref.componentInstance.dateRegister = element.dateRegister.trim();
    edref.componentInstance.docType = element.typeId.toString();
    edref.componentInstance.documentId = element.documentId

    edref.componentInstance.onDepartSelection(() => {
      edref.componentInstance.getObjectPosition(element.userPosition.trim());
    });

    this._dialogService.setDialogRef(edref);
    edref.afterClosed().subscribe({
      next: () => {
        this.loadDocuments();
      }
    })
  }

  goToDetail(document: Document) {
    this.visible = false;
  }

  //formulario de nuevos documentos
  openFormNewDoc(document?: any) {
    const dialog: MatDialogRef<NewDocumentFormComponent> = this._dialog.open(NewDocumentFormComponent);
    dialog.componentInstance.docType

    this._dialogService.setDialogRef(dialog);
    dialog.afterClosed().subscribe({
      next: () => {
        this.loadDocuments();
      }
    })

  }
}


