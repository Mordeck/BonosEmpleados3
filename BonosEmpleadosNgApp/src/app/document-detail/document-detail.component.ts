import { Component, OnInit } from '@angular/core';
import { BACKSERVER } from '../app.module';
import { HttpClient, HttpHeaderResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.sass']
})

export class DocumentDetailComponent implements OnInit
{
  document:any;
  searchText:string = ""; // busqueda en tabla

  documentDetailsDataSource:DocumentDetailsDataSource = new DocumentDetailsDataSource([]);
  displayedColumns: string[] = ['docId', 'activity'];

  constructor(private _http:HttpClient)
  {
    this.document = JSON.parse(  localStorage.getItem('document') || "" ) ;
   console.log( this.document );


    let params = new HttpParams();
    let httpHeaders = new HttpHeaders();

    const token = localStorage.getItem("token") || "";
    httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    params = params.append("docId" , this.document.docId );
    const url = BACKSERVER + '/document_detail'

    //console.log("Enviando el token", token );

    this._http.get(url, { headers:httpHeaders, params: params } ).subscribe({
      next:(resp)=>
      {
        let conver:any = resp;

        console.log("se obtuvo la respuesta detalle del doc", conver.details );

       this.documentDetailsDataSource = new DocumentDetailsDataSource( conver.details );
      },
      error:(error)=>{
        console.log("error en la respuesta detalle del doc");
      }
    });
  }

  ngOnInit(): void
  {

  }

  applyFilter()
  {}

  onHover(data:any)
  {

  }

  goToDetail(row:any)
  {}
}

export interface DocumentDetailInterface
{

}

export class DocumentDetailsDataSource extends MatTableDataSource<DocumentDetailInterface>
{

}
