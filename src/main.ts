import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from 'pipes/validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
const fileUpload = require('express-fileupload');

async function start() {
  const PORT = process.env.PORT;
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('SkyCloud')
    .setDescription('Full-featured client-server cloud storage application')
    .setVersion('1.0.0')
    .addTag('TiTUS-web')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.use(fileUpload({}));

  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

start();
