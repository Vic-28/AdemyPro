import { TestBed } from '@angular/core/testing';

import { ScormConverterServiceService } from './scorm-converter-service.service';

describe('ScormConverterServiceService', () => {
  let service: ScormConverterServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScormConverterServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
