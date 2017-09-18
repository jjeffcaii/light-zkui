import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";

type Record = { [key: string]: any }

@Injectable()
export class ZkService {

  private endpoint: string = "http://127.0.0.1:8080/v1";

  constructor(private _http: Http) {
  }

  getConf(): Observable<Record> {
    return this._http.get(`${this.endpoint}/sys/conf`).map(res => <Record>res.json())
  }

  getStats(): Observable<Record> {
    return this._http.get(`${this.endpoint}/sys/stats`).map(res => <Record>res.json())
  }

  getNodeNames(path: string): Observable<string[]> {
    return this._http.get(`${this.endpoint}/nodes/${path || ""}?ls=1`).map((res) => <string[]>res.json())
  }


}
