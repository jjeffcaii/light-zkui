import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-znode-editor',
  templateUrl: './znode-editor.component.html',
  styleUrls: ['./znode-editor.component.css']
})

export class ZnodeEditorComponent implements OnInit {

  @Input() public znode: any;
  public mode: any = {base64: true, str: false, bin: false,};

  constructor() {
  }

  ngOnInit() {
  }

}
