import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZnodesComponent } from './znodes.component';

describe('ZnodesComponent', () => {
  let component: ZnodesComponent;
  let fixture: ComponentFixture<ZnodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZnodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZnodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
