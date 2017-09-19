import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZnodeEditorComponent } from './znode-editor.component';

describe('ZnodeEditorComponent', () => {
  let component: ZnodeEditorComponent;
  let fixture: ComponentFixture<ZnodeEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZnodeEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZnodeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
