export interface IUser {
  email: string
  id: string
}

export interface IAuthInfo {
  payload: IUser
  token: string
  expiresAt: number
}