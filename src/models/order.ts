import { Profile } from "./profile";
import { Product } from "./product";
import { Distributor } from './distributor';
import { Adress } from "./adress";

export interface Order {
    id: number;
    user: Profile;
    products: Product[];
    total: number;
    adress: Adress;
    distributor: Distributor;
    dtOrder: Date;
    status:  string;   
}