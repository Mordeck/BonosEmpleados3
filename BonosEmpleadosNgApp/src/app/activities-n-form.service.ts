import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesNFormService {

  subject = new Subject();

  constructor() { }

  updateActivitiesTable()
  {
    this.subject.next(null);
  }

  viewChanges(){
    return this.subject.asObservable();
  }
}
