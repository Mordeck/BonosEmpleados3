import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DashBoardFeederService
{
  private userData = new Subject<any>;

  constructor() { }

  // establece los datos del usuario en el dashboard
  setUserData(userData:any)
  {
    this.userData.next(userData);
  }

  getUserData()
  {
    return this.userData.asObservable();
  }


}
