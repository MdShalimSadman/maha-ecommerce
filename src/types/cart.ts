import { Product } from "./product";

export interface ICartItem extends Product {
  quantity: number;
  selectedSize: number | null; 
  itemId: string;           
}