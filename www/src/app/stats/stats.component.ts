import {Component, OnInit} from '@angular/core';
import {ZkService} from "../zk.service";
import * as _ from "lodash";

type Property = { key: string, value: any };

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
  providers: [ZkService]
})

export class StatsComponent implements OnInit {

  data: Property[];

  constructor(private _zk: ZkService) {
  }

  ngOnInit(): void {
    this.getStats();
  }

  getStats(): void {
    this._zk.getStats().subscribe(stats => this.data = StatsComponent._convert(stats));
  }

  getConf(): void {
    this._zk.getConf().subscribe(conf => this.data = StatsComponent._convert(conf));
  }

  private static _convert(resp: { [key: string]: any }): Property[] {
    const foo: Property[] = [];
    _.each(resp, (v, k) => {
      foo.push({
        key: k,
        value: v,
      });
    });
    return foo;
  }
}
