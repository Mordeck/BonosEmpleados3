import { Injectable } from '@angular/core';
import { BACKSERVER } from './app.module';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonDataService {

  constructor(private _http: HttpClient) { }


  public getPositions( callBacks?: { next?: (e: any) => void,
                                     onError?: (e: any) => void })
  {
    const url = BACKSERVER + '/positions';
    this._http.get(url)
      .subscribe({ next: callBacks?.next, error: callBacks?.onError })
  }

}
