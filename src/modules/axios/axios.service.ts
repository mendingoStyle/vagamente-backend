import { Injectable } from '@nestjs/common'
import axios, { Axios } from 'axios'

@Injectable()
export class AxiosService {

  async internRequest(data: any, url: string) {
    return axios.post(process.env.INTERN_URL + '/' + url, data, {
      headers: {
        'Content-Type': 'application/json'
      },
    })
  }
}
