import { TestBed, inject } from '@angular/core/testing';

import { ZkService } from './zk.service';

describe('ZkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ZkService]
    });
  });

  it('should be created', inject([ZkService], (service: ZkService) => {
    expect(service).toBeTruthy();
  }));
});
