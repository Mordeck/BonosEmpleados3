import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvaluationsCompletedService {

  subject = new Subject();

  constructor() { }

  sendEvalId(evalid:number)
  {
    this.subject.next(evalid);
  }

  getEvalId()
  {
    return this.subject.asObservable();
  }


}
