import { Injectable } from '@nestjs/common'
import axios, { Axios } from 'axios'
require('dotenv').config()

@Injectable()
export class AxiosService {

  async internRequest(data: any, url: string) {
    try {
      const teste = await axios.post(process.env.INTERN_URL + '/' + url, data, {
        headers: {
          'Content-Type': 'application/json',
          'token': process.env.SECRET_KEY
        },
      })
      return teste
    } catch (e) {
      console.log(e)
    }
  }
}
