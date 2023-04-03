import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { endianness } from 'os';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { Repository } from 'typeorm';
import { Owner } from '../owner/entities/owner.entity';
import { OwnerAuthService } from './ownerAuth.service';

@Resolver()
export class OwnerAuthResolver {
  constructor(
    private readonly ownerAuthLogin: OwnerAuthService, //

    @InjectRepository(Owner)
    private readonly ownerRepositiory: Repository<Owner>,
  ) {}
  @Mutation(() => String)
  async ownerLogin(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: IContext,
  ) {
    const user = await this.ownerRepositiory.findOne({
      where: {
        email,
      },
    });
    await this.ownerAuthLogin.checkEmail({ email, password });

    this.ownerAuthLogin.setRefreshToken({
      user,
      res: context.res,
      req: context.req,
    });

    return this.ownerAuthLogin.getAccessToken({ user });
  }
  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreOwnerAccessToken(
    @Context() context: IContext, //
  ): string {
    console.log(context.req.user);
    return this.ownerAuthLogin.getAccessToken({ user: context.req.user });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  ownerLogout(@Context() context: IContext) {
    return this.ownerAuthLogin.logout({ context });
  }
}
