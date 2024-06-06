import { Component, ViewContainerRef, ViewChild } from '@angular/core'
import { DynamicComponentService } from '../dynamic-component.service';
import { DashBoardFeederService } from '../dash-board-feeder.service';
import { TabManagerService } from '../tab-manager.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styles: [
  ]
})
export class AdminDashboardComponent
{
  userData: any;
  tabs:any // los tabs o modulos para la barra de navegacion
  private backServer = 'http://10.20.1.57:4201/';

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dinCompContainer!: ViewContainerRef;

  constructor(
    private dinCompServ: DynamicComponentService,
    private _dsfeeder: DashBoardFeederService,
    private _tabManS: TabManagerService,
    private _http: HttpClient )
  {
    const url = this.backServer + "tabs";


    let userData  = localStorage.getItem("userData") || "";

    let tabs:any = localStorage.getItem("tabs")  || "";
    tabs = JSON.parse(tabs);
    this.tabs = tabs;

//    console.log(userData);


    this.dinCompServ.sendData({created:true});
    this.userData = JSON.parse(userData)
    this._dsfeeder.getUserData().subscribe((userData)=>{
      this.userData = userData;
     });

  }

  tabSelectedListenner(tab:string)
  {
    const tabUrl = this.backServer + "tabs";
    let params = new HttpParams();
    let user = this.userData.userName;
    params = params.append("user", user);
    params = params.append("tab", tab);

    this.dinCompServ.loadComponent(tab, this.dinCompContainer);
  }

}



