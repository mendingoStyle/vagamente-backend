import { NestFactory } from '@nestjs/core'
import { json } from 'express'
import { join } from 'path'
import { AppModule } from './app.module'
import serve from 'express-static'
import * as fs from 'fs'
export async function appBuilder() {

  const httpsOptions = {
    key: fs.readFileSync('./key2.pem'),
    cert: fs.readFileSync('./cert2.pem'),
  };
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  })
  app.enableCors({
    "origin": [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://192.168.100.10:3000',
      'http://177.73.101.148:3000',
      'http://89.116.225.8:3000',
    ],
    "methods": ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'options'],
    credentials: true,
    allowedHeaders: '*',
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
  })
  app.use(json({ limit: '50mb' }))
  app.use('/public', serve(join(process.cwd(), 'public')))
  return app
}

