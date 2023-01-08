import { NestFactory } from '@nestjs/core'
import { json } from 'express'
import { join } from 'path'
import { AppModule } from './app.module'
import serve from 'express-static'

export async function appBuilder() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.use(json({ limit: '50mb' }))
  app.use('/public', serve(join(process.cwd(), 'public')))
  return app
}

