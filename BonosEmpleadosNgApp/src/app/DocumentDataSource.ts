import { MatTableDataSource } from '@angular/material/table';

export interface DocumentInterface
{
  documentId:number;
  nomenclature:string;
  evalMonth:string;
  completed:string;
  userRegister:string;
  dateRegister:string;
  docDepartment:string;
  userPosition:string;
  multiEmployee:string;
}

export class Document extends MatTableDataSource<DocumentInterface>
{
  constructor(initialData: DocumentInterface[]) {
    super(initialData);
  }
}
