import { Component, ViewChild, ViewContainerRef, AfterViewInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { BACKSERVER } from '../app.module';
import { HttpParams } from '@angular/common/http';
import { DynamicComponentService } from '../dynamic-component.service';
import { DashBoardFeederService } from '../dash-board-feeder.service';

@Component({
  selector: 'app-evalu-dash-board',
  templateUrl: './evalu-dash-board.component.html',
  styleUrls: ['./evalu-dash-board.component.sass']
})
export class EvaluDashBoardComponent implements AfterViewInit , AfterViewChecked{
  userData: any;
  tabs:any // los tabs o modulos para la barra de navegacion
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dinCompContainer!: ViewContainerRef;

  constructor(private dinCompServ: DynamicComponentService, private _dsfeeder: DashBoardFeederService,  private cdr: ChangeDetectorRef)
  {

    this.dinCompServ.sendData({created:true});

    //los modulos a los que tiene acceso el usuario
    let tabs:any = localStorage.getItem("tabs")  || "";
    tabs = JSON.parse(tabs);
    this.tabs = tabs;

    //los datos del usuario
    let userData  = localStorage.getItem("userData") || "";
    this.userData = JSON.parse(userData)
    this._dsfeeder.getUserData().subscribe((userData)=>{
      this.userData = userData;
     });

  }
  ngAfterViewChecked(): void {
  }

  ngAfterViewInit(): void {
    this.dinCompServ.loadComponent('bonos', this.dinCompContainer);
    // this.cdr.detectChanges();

  }



  tabSelectedListenner(tab:string)
  {
    const tabUrl = BACKSERVER + "tabs";
    let params = new HttpParams();
    let user = this.userData.userName;
    params = params.append("user", user);
    params = params.append("tab", tab);

    this.dinCompServ.loadComponent(tab, this.dinCompContainer);
  }
}


