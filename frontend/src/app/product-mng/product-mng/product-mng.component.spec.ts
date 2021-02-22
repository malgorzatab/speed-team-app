import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMngComponent } from './product-mng.component';

describe('ProductMngComponent', () => {
  let component: ProductMngComponent;
  let fixture: ComponentFixture<ProductMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
