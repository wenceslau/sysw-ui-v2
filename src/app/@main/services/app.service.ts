import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscriber, lastValueFrom, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {catchError} from 'rxjs/operators'


import { HandlerService } from './handler.service';
// import { ReturnStatement } from '@angular/compiler';

export class ServiceParameter {

  constructor() {
  }

  // private _url: string = 'http://localhost:8082';
  private _httpParams: HttpParams = new HttpParams();
  private _service: Service;
  private _path: string;
  private _object: any;
  private _code: number;
  private _isBlob: Boolean

  get service(): Service {
    return this._service;
  }

  set service(s: Service) {
    this._service = s;
  }

  get path(): string {
    return this._path;
  }

  set path(p: string) {
    this._path = p;
  }

  get object(): any {
    return this._object;
  }

  set object(p: any) {
    this._object = p;
  }

  get code(): number {
    return this._code;
  }

  set code(p: number) {
    this._code = p;
  }

  get isBlob(): Boolean {
    return this._isBlob;
  }

  set isBlob(p: Boolean) {
    this._isBlob = p;
  }

  get httpParams(): HttpParams {
    return this._httpParams;
  }

  set httpParams(p: HttpParams) {
    this._httpParams = p;
  }

  addParameter(key: string, value: any) {
    this._httpParams = this._httpParams.append(key, value);
  }

}

export enum HttpVerb {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE,
}

export enum Service {
  ACCOUNT,
  CORE ,
  AUDIT
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) {
    console.log(environment.production)
  }

  // async _get(paraeters: ServiceParameter, subscriber?: Subscriber<any>): Promise<any> {

  //   let httpHeader = new HttpHeaders();
  //   httpHeader = httpHeader
  //     .append('Content-Type', 'application/json')
  //     .append('Authorization', 'Bearer ' + localStorage.getItem('token'));
  //   const url = this.url(paraeters);

  //   const source$ = this.http.get(url,{ headers: httpHeader, params: paraeters.httpParams }).pipe();
  //   return await lastValueFrom(source$)
  //     .then(response => {
  //       console.log('_get1')
  //       return response;
  //     }).catch(err => {
  //       console.log('_get2')
  //       this.handleError(err);
  //     })

  //   return this.http.get(url,
  //     { headers: httpHeader, params: paraeters.httpParams})
  //     .toPromise()
  //     .then(response => {
  //       return response;
  //     }).catch(err => {
  //       this.handleError(err);
  //     })

  // }

  get(paraeters: ServiceParameter, service: Service, subscriber?: Subscriber<any>): Promise<any> {
    return this.executeHttpRequest(HttpVerb.GET, paraeters, service, subscriber);
  }
  post(paraeters: ServiceParameter, service: Service, subscriber?: Subscriber<any>): Promise<any> {
    return this.executeHttpRequest(HttpVerb.POST, paraeters, service, subscriber);
  }
  put(paraeters: ServiceParameter, service: Service, subscriber?: Subscriber<any>): Promise<any> {
    return this.executeHttpRequest(HttpVerb.PUT, paraeters, service, subscriber);
  }
  patch(paraeters: ServiceParameter, service: Service, subscriber?: Subscriber<any>): Promise<any> {
    return this.executeHttpRequest(HttpVerb.PATCH, paraeters, service, subscriber);
  }
  delete(paraeters: ServiceParameter, service: Service, subscriber?: Subscriber<any>): Promise<any> {
    return this.executeHttpRequest(HttpVerb.DELETE, paraeters, service, subscriber);
  }

  private async executeHttpRequest(httoVerb: HttpVerb, parameters: ServiceParameter, service: Service, subscriber?: Subscriber<any>): Promise<any> {
    console.log('executeHttpRequest1')
    const httpHeader = this.geHeaders();
    const url = this.getUrlPath(parameters, service);
    console.log(url)
    let observable: Observable<any>;
    switch (httoVerb) {
      case HttpVerb.GET:
        observable = this.http.get<any>(url, { headers: httpHeader, params: parameters.httpParams });
        break;
      case HttpVerb.POST:
        observable = this.http.post<any>(url, parameters.object, { headers: httpHeader, params: parameters.httpParams })
        break;
      case HttpVerb.PUT:
        observable = this.http.put<any>(url, parameters.object, { headers: httpHeader, params: parameters.httpParams })
        break;
      case HttpVerb.PATCH:
        observable = this.http.put<any>(url, parameters.object, { headers: httpHeader, params: parameters.httpParams })
        break;
      case HttpVerb.DELETE:
        observable = this.http.delete<any>(url, { headers: httpHeader, params: parameters.httpParams })
        break;
    }


    //New way to use rxjs
    const source$ = observable.pipe();
    return await lastValueFrom(source$)
      .then(response => {
        return response;
      });

    //this way is deprecated and will be remove in versions 8 or higher of rxjs
    // return observable.toPromise()
    //   .then(response => {
    //     console.log('executeHttpRequest2')
    //     return response;
    //   })
  }

  private geHeaders() {
    let httpHeader = new HttpHeaders();
    httpHeader = httpHeader
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return httpHeader;
  }

  private getUrlPath(pars: ServiceParameter, service: Service): string {
    let path = ''
    switch (service) {
      case Service.CORE:
        path = environment.core;
        break;
      case Service.ACCOUNT:
        path = environment.account;
        break;
      case Service.AUDIT:
        path = environment.audit;
        break;
    }

    if (pars.path != null)
      path += '' + pars.path;

    if (pars.code != null)
      path += '/' + pars.code;

    return path;
  }

}
