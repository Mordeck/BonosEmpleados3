import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BonosService {
subject = new Subject();

  constructor() { }

  setCloser()
  {
    this.subject.next(true);
  }


  getCloser()
  {
    return this.subject.asObservable();
  }
}
