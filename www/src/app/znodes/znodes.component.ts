import {Component, OnInit, ViewChild} from '@angular/core';
import {ZkService, ZNode} from "../zk.service";
import * as _ from "lodash";
import {ContextMenuComponent} from "ngx-contextmenu";

@Component({
  selector: 'app-znodes',
  templateUrl: './znodes.component.html',
  styleUrls: ['./znodes.component.css'],
  providers: [ZkService],
})

export class ZnodesComponent implements OnInit {
  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;

  public paths: string[] = [];
  public nodes: string[] = [];
  public detail: ZNode;

  constructor(private _zk: ZkService) {
  }

  private pwd(): string {
    if (_.isEmpty(this.paths)) {
      return "/";
    } else {
      return this.paths.join("/");
    }
  }

  ngOnInit() {
    this.getNodeNames();
  }

  create(): void {


  }

  open(name: string): void {
    this.paths.push(name);
    this.getNodeNames();
  }

  remove(name: string) {
    const current = this.pwd();
    const foo = current === "/" ? `${current}${name}` : `${current}/${name}`;
    const yes = confirm(`Are you sure to delete '${foo}'?`);
    if (yes) {
      console.log("--------> %s", foo);
    }
  }

  view(name: string, lgModal: any): void {
    const p = `${this.pwd()}/${name}`;
    this._zk.getNode(p).subscribe(data => {
      this.detail = data;
      lgModal.show();
      console.debug("node data: %s", JSON.stringify(data));
    }, err => {
      console.error("get node data failed:", err);
    });
  }

  jump(index: number): void {
    if (index < 0) {
      this.paths.splice(0, this.paths.length);
    } else {
      this.paths.splice(index + 1, this.paths.length - index - 1);
    }
    this.getNodeNames();
  }


  getNodeNames(): void {
    this._zk.getNodeNames(this.pwd()).subscribe(names => this.nodes = names);
  }

}
