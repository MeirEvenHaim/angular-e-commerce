
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartItemsComponent } from './cart-linked-products.component';

describe('CartLinkedProductsComponent', () => {
  let component: CartItemsComponent;
  let fixture: ComponentFixture<CartItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
