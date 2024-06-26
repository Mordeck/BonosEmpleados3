import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { BACKSERVER } from '../app.module';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDialogService } from '../mat-dialog.service';
import { NewDocActivityFormComponent } from '../new-doc-activity-form/new-doc-activity-form.component';
import { ConfDelActivityComponent } from '../conf-del-activity/conf-del-activity.component';
import { ActivityCriteriaService } from '../activity-criteria.service';
import { ActivitiesNFormService } from '../activities-n-form.service';
import { fadeInOut } from '../animations/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ActivityConditionerComponent } from '../activity-conditioner/activity-conditioner.component';
import { AditionalBonusComponent } from '../aditional-bonus/aditional-bonus.component';
import { ConfirmbudgetBonoComponent } from '../confirmbudget-bono/confirmbudget-bono.component';
import { ConfirmSalesBonoComponent } from '../confirm-sales-bono/confirm-sales-bono.component';
import { MatSnackBar } from '@angular/material/snack-bar';

interface ActivitiesInterface { };

class ActivitiesDataSource extends MatTableDataSource<ActivitiesInterface>{ }

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.sass'],
  animations: [fadeInOut]
})

export class ActivitiesComponent implements AfterViewInit, OnInit {


  activitiesDataSource: ActivitiesDataSource = new ActivitiesDataSource([]);
  displayedColumns = ["activityId", "description", "owner", 'positions', 'actions'];
  searchText = "";
  httpHeaders: any;
  documentData: any;
  selectedActivity: any = null;

  @ViewChild(MatSort) sort: MatSort | null = null;
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  vtaPercent = 0;
  budgetPercent = 0;
  minAverage: any;
  currentMinimun: any;

  constructor(private _http: HttpClient,
    private _dialog: MatDialog,
    private dialogService: MatDialogService,
    private _actCriServ: ActivityCriteriaService,
    private actFormServ: ActivitiesNFormService,
    private snack: MatSnackBar) { //start contructor body

    this.actFormServ.viewChanges().subscribe({
      next: () => {
        this.loadActivities();
      }
    })



    //cuando agregas un nuevo criterio actualizas el renderizado
    this._actCriServ.getCloseNotifier().subscribe({
      next: () => {
        console.log("aqui debes realizar la busqueda de criterios");
        const url = BACKSERVER + "/criterias"
        this._http.get(url, { headers: this.httpHeaders, params: this.selectedActivity })
          .subscribe({
            next: (result) => {
              console.log("result");
              console.log(result);
              const resp: any = result;

              //si la peticion es correcta y la actividad si tiene criterios
              if (resp.status == "success") {
                //los mostramos en la tabla
                this._actCriServ.setCriterias(resp.data);
                //this._actCriServ.activityId = row.activityId;
              }
              else {
                console.log("sucedio un error al obtener los criterios");
              }

            },

            error: (error) => {
              console.log("error");
              console.log(error);

            }
          });
      }
    });

  }// ends contructor



  saveDocAverage(doc: any)
  {
    const url = BACKSERVER + '/docAverage';
    this._http.post(url,{ doc, newDocAverage:this.minAverage }).subscribe({
      next:(r:any)=>{
        if (r.status == 'success')
        {
          this.currentMinimun = this.minAverage;
          this.snack.open('Se actualizó el promedio del documento', 'Cerrar', {duration:3000});
        }
        else
        {
          this.snack.open('No se pudo actualizar el promedio del documento', 'Cerrar', {duration:3000});

        }
      },error:(error)=>{console.log('Sucedio un error en la petición', error);
      }
    })
  }

  openbudgetBonos(document: any) {
    const budgetDialog: MatDialogRef<ConfirmbudgetBonoComponent> = this._dialog.open(ConfirmbudgetBonoComponent);
    budgetDialog.componentInstance.documentData = document;
    budgetDialog.componentInstance
    budgetDialog.componentInstance.percent = this.budgetPercent;

    budgetDialog.componentInstance.getAddedBonoEmitter().subscribe({
      next: (result) => {
        budgetDialog.close();
      }
    })

  }
  openSalesBonos(document: any) {
    const saleDialog: MatDialogRef<ConfirmSalesBonoComponent> = this._dialog.open(ConfirmSalesBonoComponent);
    saleDialog.componentInstance.documentData = document;
    saleDialog.componentInstance.percent = this.vtaPercent;
    saleDialog.componentInstance.getAddedBonoEmitter().subscribe({
      next: (result) => {
        saleDialog.close();
      }
    })
  }


  ngOnInit(): void {
    this.loadActivities();
  }

  openNewActForm(element: any) {
    console.log("abriendo formulario de nueva actividad para el documento:", element);

    const newFormRef: MatDialogRef<NewDocActivityFormComponent> = this._dialog.open(NewDocActivityFormComponent);

    this.dialogService.setDialogRef(newFormRef);

    newFormRef.componentInstance.documentID = element.documentId
    newFormRef.componentInstance.activityOwner = element.userPosition.trim();
    newFormRef.componentInstance.docType = element.multiEmployee.trim();

  }

  openNewCondForm(element: any) {
    //console.log("abriendo el formulario de condicion ");
    //console.log( element );


    const acref: MatDialogRef<ActivityConditionerComponent> = this._dialog.open(ActivityConditionerComponent);
    acref.componentInstance.documentdata = element;
  }

  //cuando se da click sobre una actividad
  // para mostrar los criterios del mismo
  showCriterias(row: any) {
    console.log("Mostrando criterios", row);
    this.selectedActivity = row;
    const url = BACKSERVER + "/criterias"

    this._http.get(url, { headers: this.httpHeaders, params: this.selectedActivity })
      .subscribe({
        next: (result) => {
          console.log("result");
          console.log(result);
          const resp: any = result;

          //si la peticion es correcta y la actividad si tiene criterios
          if (resp.status == "success") {
            //los mostramos en la tabla
            this._actCriServ.setCriterias(resp.data);
            this._actCriServ.activityId = row.activityId;
          }
          else {
            console.log("sucedio un error al obtener los criterios");
          }

        },

        error: (error) => {
          console.log("error");
          console.log(error);

        }
      });
    //    this._actCriServ.setCriterias(row);

  }

  openRemoveActForm(element: any) {
    const url = BACKSERVER + "/activity";
    console.log("Eliminando el documento", element);

    const confDelRef: MatDialogRef<ConfDelActivityComponent> = this._dialog.open(ConfDelActivityComponent);
    confDelRef.componentInstance.documentData = element;

    /*
        this._http.delete(url, { headers: this.httpHeaders, body:element }).subscribe({
          next:(result)=>{
            console.log("el resultado de solicitar la eliminacion del documento");
            console.log(result);
          },
          error:(error)=>{
            console.log("Hubo un error al solicitar la eliminacion");
            console.log(error)
          }
        });
    */
  }

  openEdithActForm(element: any) {
    console.log("Editando el documento", element);

  }

  applyFilter() { }

  ngAfterViewInit(): void {
    this.loadActivities();
  }

  openAditionalBonos(documentData: any) {
    const baRef: MatDialogRef<AditionalBonusComponent> = this._dialog.open(AditionalBonusComponent);
    baRef.componentInstance.documentdata = documentData;

  }

  loadActivities() {
    const url = BACKSERVER + "/activities";

    this.activitiesDataSource.sort = this.sort;
    this.activitiesDataSource.paginator = this.paginator;

    console.log("los datos del documento");
    console.log(this.documentData);
    this.currentMinimun = this.documentData.minimunToAuth;

    const params = { documentId: this.documentData.documentId }

    this._http.get(url, { headers: this.httpHeaders, params: params }).subscribe({
      next: result => {
        //console.log("solicitando las actividades");
        //console.log(result);

        const resp: any = result;
        if (resp.status === "success") {
          //console.log("peticion de actividades exitoso");
          this.activitiesDataSource.data = resp.data;
          //console.log(this.activitiesDataSource.data);
          //console.log(resp.data);
          this.activitiesDataSource.sort = this.sort;
          this.activitiesDataSource.paginator = this.paginator;

        }

        else {
          //console.log("No se encontraron actividades para el documento", resp);
          console.log(this.activitiesDataSource.data.length);

        }

      },

      error: error => {
        console.log("error en las actividades", error);
      }
    })

  }
}
