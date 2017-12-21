import { Product } from './product';
export interface CartItem {
    product: Product;
    qtd: number;
    priceSubTotal: number;
}