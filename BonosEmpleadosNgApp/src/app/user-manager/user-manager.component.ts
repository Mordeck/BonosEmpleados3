import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { DynamicComponentService } from '../dynamic-component.service';


@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.sass']
})
export class UserManagerComponent
{
  @ViewChild('userButtonDynamicComponent', { read: ViewContainerRef }) dinCompContainer!: ViewContainerRef;

  constructor(private _dcs: DynamicComponentService){}


  addUser()
  {
    console.log("agregar usuario");
    this._dcs.loadComponent("NewUserForm", this.dinCompContainer);
  }

  userList()
  {
    console.log("lista");
    this._dcs.loadComponent("userList", this.dinCompContainer);
  }

}
