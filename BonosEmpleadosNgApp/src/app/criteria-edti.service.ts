import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CriteriaEdtiService {
  subject = new Subject();
  editedCriteria  = new Subject();

  constructor() { }

  setNewCriteriaData(criteria:any)
  {
    this.subject.next(criteria)
  }

  getNewCriteriaObservable(){
    return this.subject.asObservable();
  }


  // solo para indicar que se ha agregado un nuevo criterio
  wasCriteriaUpdated(){
    this.editedCriteria.next(true);
  }


  getEditCriteriaObserbable(){
    return this.editedCriteria.asObservable();
  }
}

