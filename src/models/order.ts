import { Profile } from "./profile";
import { Product } from "./product";
import { Distributor } from './distributor';
import { Adress } from "./adress";

export interface Order {
    id: string;
    user: Profile;
    products: Product[];
    total: number;
    adress: Adress;
    distributor: Distributor;
    dtOrder: string;
    status:  string;   
}