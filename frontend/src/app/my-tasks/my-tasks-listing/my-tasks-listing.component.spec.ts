import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTasksListingComponent } from './my-tasks-listing.component';

describe('MyTasksListingComponent', () => {
  let component: MyTasksListingComponent;
  let fixture: ComponentFixture<MyTasksListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyTasksListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTasksListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
