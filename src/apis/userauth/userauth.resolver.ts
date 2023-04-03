import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { UserAuthService } from './userauth.service';

@Resolver()
export class UserAuthResolver {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Mutation(() => String)
  async userLogin(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: IContext,
  ): Promise<string> {
    return await this.userAuthService.login({ email, password, context });
  }

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(
    @Context() context: IContext, //
  ): string {
    return this.userAuthService.getAccessToken({ user: context.req.user });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async userLogout(@Context() context: IContext) {
    return this.userAuthService.logout({ context });
  }
}
