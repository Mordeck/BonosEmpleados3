import { Injectable, ViewContainerRef } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { Subject, throwError } from 'rxjs';
import { DocumentManagerComponent } from './document-manager/document-manager.component';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { NewUserFormComponent } from './new-user-form/new-user-form.component';
import { UserListComponent } from './user-list/user-list.component';
import { BonosComponent } from './bonos/bonos.component';
import { EmployeesComponent } from './employees/employees.component';
import { ManualComponent } from './manual/manual.component';
import { BonosViewStyleDocComponent } from './bonos-view-style-doc/bonos-view-style-doc.component';
import { BonosAdminViewStyleDocComponent } from './bonos-adminView-style-doc/bonos-adminView-style-doc.component';



@Injectable({
  providedIn: 'root'
})

export class DynamicComponentService {

  constructor() { }

  private dataSubject = new Subject<any>();

  sendData(data: any) {
    this.dataSubject.next(data);
  }

  getData() {
    return this.dataSubject.asObservable();
  }


  // creado para cargar dinamicamente los componentes dependiendo del tipo de usuario
  loadComponent(nombreComponente: string, viewContainerRef: ViewContainerRef)
  {

    let component: any;

    switch(nombreComponente.trim())
    {
      case 'loginComponent':
        component = LoginComponent;
        break;

      case 'adminDashboard':
        component = AdminDashboardComponent;
        break;

      case 'DocumentManager':
        component = DocumentManagerComponent;
        break;

      case 'UserManager':
        component = UserListComponent;
        break;

      case 'NewUserForm':
        component = NewUserFormComponent;
        break;

      case 'bonos':
        component = BonosComponent;
        break;

      case 'employees':
        component = EmployeesComponent;
        break;

      case 'manual':
        component = ManualComponent;
        break;

      case 'bonosStyleDoc':
        component = BonosViewStyleDocComponent;
        break;
      case 'bonosAdminStyleDoc':
        component = BonosAdminViewStyleDocComponent;
        break;

      default :
        throw new Error('Invalid component name: ' + nombreComponente); // You can customize the error message
    }


    //intentamos eliminar el componente cargado si es que hay uno
    if (viewContainerRef != undefined)
    {
      viewContainerRef.clear();
    }
    return viewContainerRef.createComponent(component);
  }
}
