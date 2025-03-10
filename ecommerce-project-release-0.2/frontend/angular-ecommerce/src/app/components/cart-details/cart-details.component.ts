import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/service/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  
  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails(){
    //get handle to cart items
    this.cartItems = this.cartService.cartItems;

    //subcribe to the cart tota price
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
    
    //subcribe to the cart tota quantity
    this.cartService.totalPrice.subscribe(
      data => this.totalQuantity = data
    );
    
    // compute total price and quantity
    this.cartService.computerCartTotals();
  }

  incrementQuantity(cartItem: CartItem){
    this.cartService.addToCart(cartItem);
  }

  decrementQuantity(cartItem: CartItem){
    this.cartService.decrementQuantity(cartItem);
  }

  remove(cartItem: CartItem){
    this.cartService.remove(cartItem);
  }
}
