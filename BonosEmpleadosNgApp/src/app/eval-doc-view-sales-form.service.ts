import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvalDocViewSalesFormService {
  needViewIndicator = new Subject();
  isReadyIndicator = new Subject();

  constructor() { }
}
