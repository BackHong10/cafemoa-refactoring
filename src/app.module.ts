import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisClientOptions } from 'redis';
import { CafeInformModule } from './apis/cafeInform/cafeInform.module';
import { CategoryModule } from './apis/category/category.module';
import { CommentModule } from './apis/comment/comment.module';
import { OwnerModule } from './apis/owner/owner.module';
import { UserModule } from './apis/user/user.module';
import { UserAuthModule } from './apis/userauth/userauth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAccessStrategy } from './commons/auth/jwt-access.strategy';
import { JwtRefreshStrategy } from './commons/auth/jwt-refresh.strategy';
import * as redisStore from 'cache-manager-redis-store';
import { PickListModule } from './apis/pickList/pickList.module';
import { OwnerAuthModule } from './apis/ownerAuth/ownerAuth.module';
import { CommentImageModule } from './apis/commentImage.ts/commentimage.module';
import { OwnerCommentModule } from './apis/ownercomment/ownercomment.module';
import { FilesUploadModule } from './apis/fileupload/filesupload.module';
import { CafeImageModule } from './apis/cafeImage/cafeImage.module';
import { CafeMenuImageModule } from './apis/cafemenuimage/cafemenuImage.module';
import { DeletedCouponModule } from './apis/deletedcoupon/deletedcoupon.module';
import { StampHistoryModule } from './apis/stamphistory/stamphistory.module';
import { StampModule } from './apis/stamp/stamp.module';
import { CouponModule } from './apis/coupon/coupon.module';

@Module({
  imports: [
    CafeImageModule,
    CafeInformModule,
    CafeMenuImageModule,
    CategoryModule,
    CommentModule,
    CommentImageModule,
    CouponModule,
    DeletedCouponModule,
    FilesUploadModule,
    OwnerModule,
    OwnerAuthModule,
    OwnerCommentModule,
    PickListModule,
    StampModule,
    StampHistoryModule,
    UserModule,
    UserAuthModule,
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      cors: {
        origin: [
          'http://localhost:3000',
          'https://mydatabase.backkim.shop',
          'https://backkim.shop',
          'http://localhost:5500',
          'http://localhost:5501',
          'https://cafemoa.shop',
        ],
        credentials: true,
        exposedHeaders: ['Set-Cookie', 'Cookie'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: [
          'Access-Control-Allow-Headers',
          'Authorization',
          'X-Requested-With',
          'Content-Type',
          'Accept',
        ],
      },
      // playground: false,
    }),

    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://my-redis:6379',
      // url: 'redis://10.14.81.3:6379',
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtAccessStrategy, JwtRefreshStrategy],
})
export class AppModule {}
