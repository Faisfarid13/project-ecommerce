import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/service/cart.service';
import { CheckoutService } from 'src/app/service/checkout.service';
import { ShopFormServiceService } from 'src/app/service/shop-form-service.service';
import { FormValidators } from 'src/app/validators/form-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCarYears: number[]=[];
  creditCarMonths: number[]=[];
  countries: Country[]=[];
  state: State[]=[];

  shippingAddressStates: State[]=[];
  billingAddressStates: State[]=[];
  
  constructor(private formBuilder: FormBuilder,
              private shopFormService: ShopFormServiceService,
              private cartService: CartService,
              private checkoutService : CheckoutService,
              private router: Router) { }

  ngOnInit(): void {
    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', 
          [Validators.required, 
            Validators.minLength(2), 
            FormValidators.notOnlyWhitespace]),
        lastName: new FormControl('', 
          [Validators.required, 
            Validators.minLength(2), 
            FormValidators.notOnlyWhitespace]),
        email: new FormControl('', 
          [Validators.required, 
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      }),

      shippingAddress: this.formBuilder.group({
        country:new FormControl('', 
          [Validators.required]),
        city:new FormControl('', 
          [Validators.required, 
            Validators.minLength(2), 
            FormValidators.notOnlyWhitespace]),
        state:new FormControl('', 
          [Validators.required]),
        street:new FormControl('', 
          [Validators.required, 
            Validators.minLength(2), 
            FormValidators.notOnlyWhitespace]),
        zipCode:new FormControl('', 
          [Validators.required, 
            Validators.minLength(2), 
            FormValidators.notOnlyWhitespace]),
      }),

      billingAddress: this.formBuilder.group({
        country:new FormControl('', 
          [Validators.required]),
        city:new FormControl('', 
          [Validators.required, 
            Validators.minLength(2), 
            FormValidators.notOnlyWhitespace]),
        state:new FormControl('', 
          [Validators.required]),
        street:new FormControl('', 
          [Validators.required, 
            Validators.minLength(2), 
            FormValidators.notOnlyWhitespace]),
        zipCode:new FormControl('', 
          [Validators.required, 
            Validators.minLength(2), 
            FormValidators.notOnlyWhitespace]),
      }),

      creditCard: this.formBuilder.group({
        cardType:new FormControl('', 
          [Validators.required]),
        nameOnCard:new FormControl('', 
          [Validators.required,
          Validators.minLength(2), 
          FormValidators.notOnlyWhitespace]),
        cardNumber:new FormControl('', 
          [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode:new FormControl('', 
          [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth:[''],
        expirationYear:[''],
      })
    });

    // populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCarMonths = data;
      }
    );

    //populate credit card year
    this.shopFormService.getCreditCardYears().subscribe(
      data => {
        this.creditCarYears = data;
      }
    );

    //populate countries
    this.shopFormService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    );
  }

  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  get firstName(){return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){return this.checkoutFormGroup.get('customer.lastName');}
  get email(){return this.checkoutFormGroup.get('customer.email');}

  get shippingStreet(){return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingCity(){return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingState(){return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingZipcode(){return this.checkoutFormGroup.get('shippingAddress.zipCode');}
  get shippingCountry(){return this.checkoutFormGroup.get('shippingAddress.country');}
  
  get billingStreet(){return this.checkoutFormGroup.get('billingAddress.street');}
  get billingCity(){return this.checkoutFormGroup.get('billingAddress.city');}
  get billingState(){return this.checkoutFormGroup.get('billingAddress.state');}
  get billingZipcode(){return this.checkoutFormGroup.get('billingAddress.zipCode');}
  get billingCountry(){return this.checkoutFormGroup.get('billingAddress.country');}
  
  get creditCardType(){return this.checkoutFormGroup.get('creditCard.cardType');}
  get creditCardName(){return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardNumber(){return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurity(){return this.checkoutFormGroup.get('creditCard.securityCode');}
  get creditCardExpMonth(){return this.checkoutFormGroup.get('creditCard.expirationMonth');}
  get creditCardExpYear(){return this.checkoutFormGroup.get('creditCard.expirationYear');}
  
  getStates(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;

    this.shopFormService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        }else{
          this.billingAddressStates = data;
        }

        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }

  copyShippingAddressToBillingAddress(event: Event){
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.checked) {
      this.checkoutFormGroup.controls['billingAddress']
            .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      // bug fix for states
      this.billingAddressStates = this.shippingAddressStates;

    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      // bug fix for states
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    //if current equals selected year
    let startMonth: number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    }else{
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCarMonths = data;
      }
    )
  }

  onSubmit(){
    console.log("submit berhasil");

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    //for debugging
    // console.log(this.checkoutFormGroup.get('customer')?.value);
    // console.log(this.checkoutFormGroup.get('customer')?.value.firstName);

    // console.log(`the Shipping country is : `+this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
    // console.log(`the Shipping state is : `+this.checkoutFormGroup.get('shippingAddress')?.value.state.name);

    //set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    //get cart items
    const cartitems = this.cartService.cartItems;

    //create orderitems from cartitems
    //long way
    // let orderItems: OrderItem[] = [];
    // for(let i=0; i<cartitems.length; i++){
    //   orderItems[i] = new OrderItem(cartitems[i]);
    // }

    //short way
    let orderItems: OrderItem[] = cartitems.map(tempCartItem => new OrderItem(tempCartItem));

    //set up purchase
    let purchase = new Purchase();

    //populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //populate purchase - shiping
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress?.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress?.country));
    purchase.shippingAddress!.state = shippingState.name;
    purchase.shippingAddress!.country = shippingCountry.name;
    
    //populate purchase - billing
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress?.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress?.country));
    purchase.billingAddress!.state = billingState.name;
    purchase.billingAddress!.country = billingCountry.name;

    //populate purchase - order and order items
    purchase.order = order;
    purchase.orderItems = orderItems;

    //call rest api via checkoutservice
    this.checkoutService.placeOrder(purchase).subscribe({
        next: response => {
          alert(`Your Order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

          //reset cart
          this.resetCart();
        },
        error: err => {
          alert(`There was an error ${err.message}`);
        }
      }
    );
  }
  
  resetCart() {
    //reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    
    //reset the form data
    this.checkoutFormGroup.reset();

    //navigate back to the products page
    this.router.navigateByUrl("/products");
  }

}
