import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesAditionalsBonusService {

  transferer = new Subject();

  getTranferer()
  {
    return this.transferer.asObservable();
  }

  sendQueryParams(data:any)
  {
    this.transferer.next(data);
  }

  indicator = new Subject();

  salesAditionalIsReady(){
    return this.indicator.asObservable();
  }

  constructor() { }
}
