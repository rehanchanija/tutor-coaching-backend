import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('SRK Coaching API')
    .setDescription('The SRK Coaching API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  app.enableCors();
  
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  
  const serverUrl = await app.getUrl();
  const swaggerUrl = `${serverUrl}/api`;
  
  console.log(`\x1b[32m[Nest] Server is running on: \x1b[36m${serverUrl}\x1b[0m`);
  console.log(`\x1b[32m[Nest] Swagger Documentation: \x1b[36m${swaggerUrl}\x1b[0m`);
}
bootstrap();
