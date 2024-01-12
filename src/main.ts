import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();
const timeout = require('connect-timeout');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middleware для разрешения CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
  });

  const PORT = process.env.PORT || 8080;
  app.setGlobalPrefix('api');
  app.use(timeout('50s'));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle("Scientist's room")
    .setDescription('API documentation for project at Ala-Too ')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(PORT, () => console.log(`App started on port ${PORT}`));
}
bootstrap();
