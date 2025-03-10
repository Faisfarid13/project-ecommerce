import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  cartItems: CartItem[]=[];
  
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  
  constructor() { }
  
  addToCart(theCartItem: CartItem){
    //check if cart not null
    let alreadyExistInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;
    
    if(this.cartItems.length > 0){
      //find the item on cart based id
      // for(let tempCartItem of this.cartItems){
        //   if(tempCartItem.id === theCartItem.id){
          //     existingCartItem = tempCartItem;
          //     break;
          //   }
          // }
          existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id );
          //check if founded
          alreadyExistInCart = (existingCartItem !== undefined);
        }
        
        if(alreadyExistInCart){
          existingCartItem!.quantity++;
        }else{
          this.cartItems.push(theCartItem);
        }
        
        //compute cart total
        this.computerCartTotals();
      }
      
      computerCartTotals() {
        let totalPriceValue: number = 0;
        let totalQuantityValue: number = 0;
        
        for(let currentCartItem of this.cartItems){
          totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
          totalQuantityValue += currentCartItem.quantity;
        }
        
        this.totalPrice.next(totalPriceValue);
        this.totalQuantity.next(totalQuantityValue);
        
        this.logCartData(totalPriceValue, totalQuantityValue);
      }
      
      logCartData(totalPriceValue: number, totalQuantityValue: number) {
        console.log('content of the cart');
        for(let tempCartItem of this.cartItems){
          const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
          
          console.log(`name: ${tempCartItem.name}, unit price: ${tempCartItem.unitPrice}, quantity: ${tempCartItem.quantity}`);
        }
        console.log(`total price: ${totalPriceValue.toFixed(2)}, total quantity: ${totalQuantityValue}`)
        console.log(`---------`)
      }
      
      decrementQuantity(cartItem: CartItem) {
        cartItem.quantity--;

        if(cartItem.quantity == 0){
          this.remove(cartItem);
        }else{
          this.computerCartTotals();
        }
      }

      remove(cartItem: CartItem) {
        //get index of item in array
        const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === cartItem.id);

        //if found remove the item
        if(itemIndex > -1){
          this.cartItems.splice(itemIndex, 1);

          this.computerCartTotals();
        }
      }
    }
    