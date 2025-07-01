import { TestBed } from '@angular/core/testing';

import { ProductManagementService } from './product-management.service';

describe('ProductService', () => {
  let service: ProductManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
