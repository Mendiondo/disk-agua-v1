import { CartItem } from './cartItem';
import { User } from './user';
export interface Cart {
    cartItem: CartItem;
    user: User;
}