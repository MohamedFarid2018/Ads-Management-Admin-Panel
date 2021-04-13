import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsHomeComponent } from './tags-home.component';

describe('TagsHomeComponent', () => {
  let component: TagsHomeComponent;
  let fixture: ComponentFixture<TagsHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
