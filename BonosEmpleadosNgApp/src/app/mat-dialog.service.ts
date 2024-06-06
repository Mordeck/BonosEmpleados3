import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MatDialogService {

  private dialogRef: MatDialogRef<any> | null = null;
  private subject: Subject<any> = new Subject<any>();

  constructor() {
    this.dialogRef = null;
  }

  setDialogRef(dialogRef: MatDialogRef<any>): void
  {
    console.log("La referencia al dialogo actual es:", dialogRef )
    this.dialogRef = dialogRef;
  }

  closeDialog(): void
  {
    this.subject.next(true);

    if (this.dialogRef)
    {
      this.dialogRef.close();
    }
  }

  private dialogs:Set<MatDialogRef<any>> = new Set<MatDialogRef<any>>();

  listenCLoser()
  {
    return this.subject.asObservable();
  }

  getRef()
  {
    return this.dialogRef;
  }

}
