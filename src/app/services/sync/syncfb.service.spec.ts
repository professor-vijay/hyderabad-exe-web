import { TestBed } from '@angular/core/testing';

import { SyncfbService } from './syncfb.service';

describe('SyncService', () => {
  let service: SyncfbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyncfbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
