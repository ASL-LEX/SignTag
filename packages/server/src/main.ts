import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // CORs for React Admin content-range header
  app.enableCors({
    exposedHeaders: ['Content-Range']
  });

  // Setup OpenAPI (Swagger)
  const config = new DocumentBuilder()
    .setTitle('SignTag API')
    .setDescription('API documentation for SignTag')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // DTO validation
  app.useGlobalPipes(
    new ValidationPipe({

      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        console.error(JSON.stringify(validationErrors));
        return new BadRequestException(validationErrors);
      },
      transform: true,
      whitelist: true
    })
  );

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
