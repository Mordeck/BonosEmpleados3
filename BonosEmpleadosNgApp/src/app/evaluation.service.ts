import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  subject = new Subject();

  constructor() { }

  setEvaluationData(evalData:any)
  {
    this.subject.next(evalData)
  }

  getEvaluationData()
  {
    return this.subject.asObservable();
  }
}
