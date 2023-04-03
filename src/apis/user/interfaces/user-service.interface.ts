import { IContext } from 'src/commons/types/context';
import { CreateUserInput } from '../dto/user-create.input';
import { UpdateUserInput } from '../dto/user-update.input';

export interface IUserServiceCreate {
  createUserInput: CreateUserInput;
}

export interface IUserServiceUpdate {
  updateUserInput: UpdateUserInput;
  context: IContext;
}
