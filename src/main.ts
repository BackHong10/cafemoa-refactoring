import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://mydatabase.backkim.shop',
      'https://backkim.shop',
      'http://localhost:5500',
      'http://localhost:5501',
      'https://cafemoa.shop',
    ],
    credentials: true,
  });

  app.use(graphqlUploadExpress());
  app.useStaticAssets(join(__dirname, '..', 'static'));
  await app.listen(3000);
}
bootstrap();
