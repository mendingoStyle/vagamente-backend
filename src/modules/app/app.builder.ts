import { NestFactory } from '@nestjs/core'
import { json } from 'express'
import { join } from 'path'
import { AppModule } from './app.module'
import serve from 'express-static'
import * as fs from 'fs'
import { BadRequestException } from '@nestjs/common'
require('dotenv').config()

export async function appBuilder() {

  const httpsOptions = {
    key: null,
    cert: null,
  };

  let appOptions = {};
  const whitelist = [
    'https://vagamente.com.br',
    'https://www.vagamente.com.br',
  ]
  if (process.env.APP_ENV === 'PRODUCTION') {
    httpsOptions.key = fs.readFileSync('./key.pem');
    httpsOptions.cert = fs.readFileSync('./cert2.pem');

    appOptions = {
      httpsOptions
    }
  } else {
    whitelist.push('http://localhost:3000', undefined)
  }

  const app = await NestFactory.create(AppModule, appOptions)
  app.enableCors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 ) {
        callback(null, true)
      } else {
        console.log("blocked cors for:", origin)
        callback(new BadRequestException({
          statusCode: 500,
          message: 'Forbidden Origin, Cors Error',
          error: 'Bad Request',
        }), false)
      }
    },
    "methods": ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  })
  app.use(json({ limit: '50mb' }))
  app.use('/public', serve(join(process.cwd(), 'public')))
  return app
}

