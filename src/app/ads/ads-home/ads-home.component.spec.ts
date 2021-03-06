import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdHomeComponent } from './ads-home.component';

describe('AdHomeComponent', () => {
  let component: AdHomeComponent;
  let fixture: ComponentFixture<AdHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
