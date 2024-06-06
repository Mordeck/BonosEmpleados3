import { Component, Input, OnInit, EventEmitter, Output, ViewContainerRef, ViewChild } from '@angular/core';
import { TabManagerService } from '../tab-manager.service';
import { contrast } from '../animations/animations';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'adm-navbar',
  templateUrl: './adm-navbar.component.html',
  styleUrls: ['./adm-navbar.component.sass'],
  animations:[contrast]
})

export class AdmNavbarComponent implements OnInit
{
  @Input() userData:any;
  @Input() tabs:any;//los modulos a los que puedes acceder este tipo de usuario
  tabNames:any;
  @Output() tabSelected = new EventEmitter<any>();
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dinCompContainer!: ViewContainerRef;

  cleanTabArr()
  {
    console.log("Limpiando las pestañas");
    this.tabNames = [...this.userData.permissions];
  }

  ngOnInit()
  {

  }

  constructor(private _tabManService: TabManagerService)
  {
    this._tabManService.getChanges().subscribe({
      next:(tabName)=>
      {
        this.tabSelected.emit(tabName);
      }
    });
  }
}
