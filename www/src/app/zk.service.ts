import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import * as _ from "lodash";

@Injectable()
export class ZkService {

  private endpoint: string = "http://127.0.0.1:8080/v1";

  constructor(private _http: Http) {
  }

  getStats(): Observable<any> {
    return this._http.get(`${this.endpoint}/stats`)
      .map(res => {
        const data = <{ [key: string]: string }>res.json();
        const ret: { key: string, value: string }[] = [];
        _.each(data, (v, k) => {
          ret.push({
            key: k,
            value: v,
          });
        });
        return ret;
      })
      .do(data => console.log("stats: %s", JSON.stringify(data)))
  }

  getNodeNames(path: string): Observable<string[]> {
    return this._http.get(`${this.endpoint}/nodes/${path || ""}?ls=1`)
      .map((res) => <string[]>res.json())
      .do(data => console.log("list nodes for path %s: %s", (path || "/"), JSON.stringify(data)));
  }


}
