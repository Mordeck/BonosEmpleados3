import { AfterContentInit, AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, Renderer2, SimpleChanges, } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewActCriteriaComponent } from '../new-act-criteria/new-act-criteria.component';
import { ActivityCriteriaService } from '../activity-criteria.service';
import { MatDialogService } from '../mat-dialog.service';
import { fadeInOut } from '../animations/animations';
import { RemoveCriteriaComponent } from '../remove-criteria/remove-criteria.component';
import { EditCriteriaComponent } from '../edit-criteria/edit-criteria.component';
import { CriteriaEdtiService } from '../criteria-edti.service';
import { HttpHeaders } from '@angular/common/http';



@Component({
  selector: 'app-criterias',
  templateUrl: './criterias.component.html',
  styleUrls: ['./criterias.component.sass'],
  animations: [fadeInOut]
})
export class CriteriasComponent implements AfterViewInit {


  displayedColumns = ["id", "description", "weighting", 'actions']
  criteriasDataSource: any;

  //cuando se selecciona una actividad
  actSelected = false;
  activity: any;

  contextMenuVisible: boolean = false;
  criteriaToContextMenu: any;
  coordsToContext: { x: number, y: number } = { x: 0, y: 0 }
  private resizeObserver: ResizeObserver = new ResizeObserver(() => {
    console.log("el resized");

  });
  httpHeaders: any;


  constructor(private _dialog: MatDialog,
    private _actCriServ: ActivityCriteriaService,
    private _dialogService: MatDialogService,
    private renderer: Renderer2,
    private _editServ: CriteriaEdtiService,
    private el: ElementRef) {
    this._actCriServ.getCriterias().subscribe({
      next: (criteria) => {
        //console.log("Obteniendo el criterio", criteria);
        this.criteriasDataSource = criteria;
        console.log("el data source de criterias", this.criteriasDataSource);
      }

    });

    const token = localStorage.getItem("token") || "";
    this.httpHeaders = new HttpHeaders({
    'Authorization': `Bearer ${token}`    });
  }

  remove(row: any)
  {
    console.log("eliminando");
    console.log(row);

    const remCriDia:MatDialogRef<RemoveCriteriaComponent> = this._dialog.open(RemoveCriteriaComponent);
    remCriDia.componentInstance.criteriaData = row;
    this._dialogService.setDialogRef(remCriDia);


  }



  edit(row: any) {
    console.log("editando");
    const dialoRfEdit:MatDialogRef<EditCriteriaComponent> = this._dialog.open(EditCriteriaComponent);
    this._editServ.setNewCriteriaData(row);
    this._dialogService.setDialogRef(dialoRfEdit)
  }

  onRightClick(row: any, event: MouseEvent) {
    event.preventDefault();
    console.log("cambiando la ubicación");
    this.coordsToContext = { x: event.clientX, y: event.clientY };
    console.log(this.coordsToContext);


    this.contextMenuVisible = !this.contextMenuVisible;
    this.criteriaToContextMenu = row;
  }

  searchText: any;

  openNewCritForm() {
    console.log("abriendo el form new crit");

    const newCritFormRef: MatDialogRef<NewActCriteriaComponent> = this._dialog.open(NewActCriteriaComponent);
    newCritFormRef.componentInstance.activityId = this._actCriServ.activityId;
    this._dialogService.setDialogRef(newCritFormRef);


  }

  applyFilter() {

  }

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(() => {
      // Handle the resize event here
      const rect = this.el.nativeElement.getBoundingClientRect();

    });

    this.resizeObserver.observe(this.el.nativeElement);
  }

  // This method will be called during a mousemove event
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    // Handle the mousemove event here
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    //console.log('Mouse position:', mouseX, mouseY);
  }




}
