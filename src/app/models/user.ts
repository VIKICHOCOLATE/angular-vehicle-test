import { Owner } from './owner';
import { Vehicle } from './vehicle';

export class User {
  userid: number;
  name: string;
  owner: Owner;
  vehicles: Vehicle[];
}
