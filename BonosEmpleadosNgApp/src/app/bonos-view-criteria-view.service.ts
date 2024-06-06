import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BonosViewCriteriaViewService {

  //transferer = new EventEmitter<any>();
  emitter = new EventEmitter<any>();

  constructor()
  {

  }
}
