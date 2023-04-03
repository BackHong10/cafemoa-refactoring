import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { CreateUserInput } from './dto/user-create.input';
import { UpdateUserInput } from './dto/user-update.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return await this.userService.create({
      createUserInput,
    });
  }

  @Query(() => [User])
  fetchUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Mutation(() => String)
  emailVerify(@Args('email') email: string) {
    return this.userService.emailVerify({ email });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchUser(@Context() context: IContext): Promise<User> {
    return this.userService.find({ id: context.req.user.id });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [User])
  fetchCouponAddUsers(
    @Args({ name: 'phone', type: () => String, nullable: true }) phone: string,
    @Args({ name: 'page', type: () => Int, nullable: true }) page: number,
  ) {
    page = page === undefined ? 1 : page;
    return this.userService.findCouponUser({ phone, page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateUser(
    @Context() context: IContext,
    @Args('updateUserInput') updateUserInput: UpdateUserInput, //
  ) {
    return await this.userService.update({
      updateUserInput,
      context,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteUser(@Context() context: IContext): Promise<boolean> {
    return this.userService.delete({ userId: context.req.user.id });
  }

  @Mutation(() => String)
  findUserPwd(@Args('email') email: string) {
    return this.userService.findUserPwd({ email });
  }
}
