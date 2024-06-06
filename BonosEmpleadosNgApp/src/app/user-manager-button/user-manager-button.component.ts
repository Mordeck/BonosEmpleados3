import { Component, Input, ViewChild, ViewContainerRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-manager-button',
  templateUrl: './user-manager-button.component.html',
  styleUrls: ['./user-manager-button.component.sass']
})
export class UserManagerButtonComponent
{
  @Input()  text = "";
  @Input()  icon = "";

}
