import {Component, OnInit} from '@angular/core';
import {ZkService} from "../zk.service";
import * as _ from "lodash";

@Component({
  selector: 'app-znodes',
  templateUrl: './znodes.component.html',
  styleUrls: ['./znodes.component.css'],
  providers: [ZkService],
})

export class ZnodesComponent implements OnInit {

  paths: string[] = ["armyant", "tasks"];
  nodes: string[] = [];

  constructor(private _zk: ZkService) {
  }

  private pwd(): string {
    if (_.isEmpty(this.paths)) {
      return "/";
    } else {
      return this.paths.join("/");
    }
  }

  open(name: string) {
    this.paths.push(name);
    this.getNodeNames();
  }

  jump(index: number): void {
    if (index < 0) {
      this.paths.splice(0, this.paths.length);
    } else {
      this.paths.splice(index + 1, this.paths.length - index - 1);
    }
    this.getNodeNames();
  }

  ngOnInit() {
    this.getNodeNames();
  }

  getNodeNames(): void {
    this._zk.getNodeNames(this.pwd()).subscribe(names => this.nodes = names);
  }

}
