import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocViewConditionViewService {
  emitter = new EventEmitter<any>();
  constructor() { }
}
