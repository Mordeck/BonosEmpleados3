import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EvalDocFinalAuthService {
  emitter  = new EventEmitter<any>();
  constructor() { }
}
