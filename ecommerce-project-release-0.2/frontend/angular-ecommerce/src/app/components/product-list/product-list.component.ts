import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/service/cart.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  
  products: Product[]=[];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  //props for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string ='';

  constructor(private productService:ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      console.log("lagi mode search");
      this.handleSearchProducts();
    }else{
      console.log("lagi BUKAN mode search");
      this.handleListProducts();
    }
  }

  handleListProducts(){
    //check id paramater is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      //get id
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }else{
      //id not exist
      this.currentCategoryId = 1;
    }

    //check if we have diff category
    // if category id != previous
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`current category id = ${this.currentCategoryId}, the page number = ${this.thePageNumber}`);

    this.productService.getProductListPaginate(this.thePageNumber-1, this.thePageSize, this.currentCategoryId)
      .subscribe(this.processResult());
  }

  handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    console.log(`keyword : ${theKeyword}`);
    
    //if keyword diff to previous set number page to 1
    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}, page number=${this.thePageNumber}`);

    //search for product
    this.productService.searchProductPaginate(this.thePageNumber -1,
                                              this.thePageSize,
                                              theKeyword
    ).subscribe(this.processResult());
  }

  updatePageSize(pageSize: string){
    console.log(`page size : ${pageSize}`)
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  processResult(){
    return(data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  addToCart(theProduct: Product){
    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }

}
