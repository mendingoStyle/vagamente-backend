import { NestFactory } from '@nestjs/core'
import { json } from 'express'
import { join } from 'path'
import { AppModule } from './app.module'
import serve from 'express-static'
import * as fs from 'fs'
require('dotenv').config()

export async function appBuilder() {

  const httpsOptions = {
    key: null,
    cert: null,
  };

  let appOptions = {};

  if (process.env.APP_ENV === 'PRODUCTION') {
    httpsOptions.key = fs.readFileSync('./key2.pem');
    httpsOptions.cert = fs.readFileSync('./cert2.pem');

    appOptions = {
      httpsOptions
    }
  }

  const app = await NestFactory.create(AppModule, appOptions)
  app.enableCors({
    "origin": [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://192.168.100.10:3000',
      'https://vagamente.com.br',
      'https://www.vagamente.com.br',
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

