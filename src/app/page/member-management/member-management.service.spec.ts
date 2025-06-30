import { TestBed } from '@angular/core/testing';

import { MemberManagementService } from './member-management.service';

describe('MemberManagementService', () => {
  let service: MemberManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemberManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
