import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityCriteriaService {
  subject          = new Subject<any>();
  closeNotificator = new Subject<any>();

  constructor()
  {

   }

   setCriterias(criterias:any)
   {
    console.log("mandando el criterio", criterias);

    this.subject.next(criterias)
   }

   getCriterias()
   {
    return this.subject.asObservable();
  }

  getCloseNotifier(){

    return this.closeNotificator.asObservable();
   }

  setIsClose()
  {
    this.closeNotificator.next(true);
  }

   //el id de la actividad para lo crear nuevos criterios con el formulario
   activityId = 0;

}
