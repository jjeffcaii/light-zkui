import {Component, OnInit} from '@angular/core';
import {ZkService} from "../zk.service";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
  providers: [ZkService]
})
export class StatsComponent implements OnInit {

  stats: { key: string, value: string }[];

  constructor(private _zk: ZkService) {
  }

  ngOnInit(): void {
    this._zk.getStats().subscribe(stats => this.stats = stats);
  }

}
