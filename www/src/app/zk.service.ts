import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {environment} from "../environments/environment";
import * as _ from "lodash";

type Record = { [key: string]: any }

export interface ZNode {
  path: string,
  data: string,
  numChildren: number,
}

@Injectable()
export class ZkService {

  private endpoint: string;

  constructor(private _http: Http) {
    this.endpoint = `${environment.endpoint}/v1`;
  }

  getConf(): Observable<Record> {
    return this._http.get(`${this.endpoint}/sys/conf`).map(res => <Record>res.json())
  }

  getStats(): Observable<Record> {
    return this._http.get(`${this.endpoint}/sys/stats`).map(res => <Record>res.json())
  }

  getNodeNames(path: string): Observable<string[]> {
    return this._http.get(`${this.endpoint}/nodes/${ZkService.mkpath(path)}?ls=1`).map((res) => <string[]>res.json())
  }

  getNode(path: string): Observable<ZNode> {
    const p = ZkService.mkpath(path);
    return this._http.get(`${this.endpoint}/nodes/${p}`)
      .map(res => {
        const ret = <ZNode>res.json();
        ret.path = "/" + p;
        return ret;
      });
  }

  private static mkpath(path: string): string {
    if (!path) {
      return "";
    } else {
      return _.trim(path.replace(/\/+/g, "/"), "/");
    }
  }

}
