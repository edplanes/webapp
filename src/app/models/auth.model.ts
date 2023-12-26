export interface IUser {
  email: string;
  id: string;
  username: string;
  roles: string[];
}

export interface IAuthInfo {
  payload: IUser;
  token: string;
  expiresAt: number;
}
