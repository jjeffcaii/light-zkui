import {Component, OnInit} from '@angular/core';
import {ZkService} from "./zk.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ZkService]
})
export class AppComponent implements OnInit {

  stats: { key: string, value: string }[];

  constructor(private _zk: ZkService) {
  }

  ngOnInit(): void {
    this._zk.getStats().subscribe(stats => this.stats = stats);
  }


}
