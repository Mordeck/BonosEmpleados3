    import { Injectable } from '@angular/core';
  import { MatDialogService } from './mat-dialog.service';

  import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpHeaders,
  } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
  import { Router } from '@angular/router';

  @Injectable()
  export class AuthInterceptor implements HttpInterceptor {
    httpHeaders: HttpHeaders = new HttpHeaders();

    constructor(private router: Router, private _dialogService:MatDialogService)
    {

    }

    intercept(
      request: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>>
    {

      let modifiedRequest = request;

      //si es cualquier otra ruta ya tenemos el token y debemos enviarlo
      if ( this.router.url != '/login' ) {
        this.httpHeaders = this.httpHeaders.delete('Authorization')// si ya tiene un encanbezado con auth lo borramos
        const token = localStorage.getItem("token") || "";
        this.httpHeaders =  this.httpHeaders.append( 'Authorization', `Bearer ${token}` );
        modifiedRequest = request.clone({ headers: this.httpHeaders });
        //console.log('agregando el token', token);
        //console.log('url:', request.url);

        //console.log('headers', modifiedRequest.headers.getAll('Authorization'));

      }

      //enviamos el token en todas las peticiones


      return next.handle(modifiedRequest).pipe(
        tap(
          (event) => {
          //  console.log(event)
          },
          (error) => {
            if (error.status === 403) {
              // Redirigir al usuario al login si recibe un código de estado 403
              this.router.navigate(['/login']);


              //intento de cerrar los dialogos abiertos cuando se acaba la session
              //console.log("La referencia al dialogo actual es:");
              //console.log(this._dialogService.getRef())
              this._dialogService.closeDialog();
            }

            else {
              console.log("************ el token esta vigente *******");

            }
          }
        )
      );
    }
  }
