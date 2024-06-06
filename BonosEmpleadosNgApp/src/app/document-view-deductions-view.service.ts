import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentViewDeductionsViewService {
  emitter = new EventEmitter<any>();
  constructor() {

  }
}
