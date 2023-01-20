
export interface IAccessToken {
  id: string
  sub: string
  iat?: number
  exp?: number
  changePassword?: boolean
  confirmEmail: boolean
  name?: string
  email?: string
  refresh?: boolean
}
