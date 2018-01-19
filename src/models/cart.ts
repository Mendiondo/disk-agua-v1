import { User } from './user';
import { Product } from './product';
export interface Cart {
    products: Product[];
    user: User;
}