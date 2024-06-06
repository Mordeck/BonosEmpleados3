import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TabManagerService
{
  tabNotificator = new Subject();

  constructor() { }

  notify(notificacion:any)
  {
    this.tabNotificator.next(notificacion);
  }

  getChanges()
  {
    return this.tabNotificator.asObservable();
  }


}
