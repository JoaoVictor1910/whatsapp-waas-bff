import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '@/modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('E-commerce Order Processing')
    .setDescription('BFF for WaaS')
    .setVersion('1.0')
    .addTag('orders')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('BFF', app, document);

  await app.listen(process.env.HTTP_PORT, '0.0.0.0', () =>
    console.log(`Listening on port ${process.env.HTTP_PORT}.`),
  );
}
bootstrap();
