import { Injectable } from '@nestjs/common'
import axios, { Axios } from 'axios'

@Injectable()
export class AxiosService {

  async internRequest(data: any, url: string) {
    try {
      const teste = await axios.post(process.env.INTERN_URL + '/' + url, data, {
        headers: {
          'Content-Type': 'application/json'
        },
      })
      return teste
    } catch (e) {
    }
  }
}
