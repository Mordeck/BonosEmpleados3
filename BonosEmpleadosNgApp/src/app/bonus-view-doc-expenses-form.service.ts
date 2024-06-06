import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BonusViewDocExpensesFormService  {
  // para transferir los datos que usara el formulario
  transmitter = new Subject();

  //solo para indicar que esta listo
  readyIndicator = new Subject();



  constructor() { }
}
