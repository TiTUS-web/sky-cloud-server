import { User } from '../users/users.model';

export type TAuthResponse = {
  token: string;
  user: User;
};
