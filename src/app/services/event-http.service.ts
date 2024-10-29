import { Injectable } from '@angular/core';

import {  IEventFormReq, IMonth } from '../interfaces/events.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class EventHttpService {
 baseUrl = 'http://localhost:3000'
  constructor(private _http: HttpClient) { }

getMonths():Observable<IMonth[]>{
  return this._http.get<IMonth[]>(`${this.baseUrl}/months`)
}


createFormApp(req:IEventFormReq):Observable<any>{
  return this._http.post<any>(`${this.baseUrl}/submittions`,req)
}
}
