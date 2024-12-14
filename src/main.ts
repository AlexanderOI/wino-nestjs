import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: process.env.APP_URL,
  })

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('API Documentation')
    .setDescription('API Description')
    .setVersion('1.0')
    .addTag('auth')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  await app.listen(process.env.PORT)
}
bootstrap()
