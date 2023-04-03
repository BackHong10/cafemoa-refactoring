import { User } from 'src/apis/user/entities/user.entity';
import { IAuthUserItem, IContext } from 'src/commons/types/context';

export interface IUserAuthloginService {
  email: string;
  password: string;
  context: IContext;
}

export interface IUserAuthServiceGetAccessToken {
  user: User | IAuthUserItem;
}

export interface IUserAuthServiceLogout {
  context: IContext;
}
