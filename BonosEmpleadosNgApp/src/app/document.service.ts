import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  transmitter = new Subject()

  sendDocument(document:any)
  {
    this.transmitter.next(document);
  }

  getTransmitter()
  {
    return this.transmitter.asObservable();
  }

  constructor() { }

}
