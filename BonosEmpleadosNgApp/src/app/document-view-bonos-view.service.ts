import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentViewBonosViewService {
  emitter = new EventEmitter<any>();

  constructor() { }
}
