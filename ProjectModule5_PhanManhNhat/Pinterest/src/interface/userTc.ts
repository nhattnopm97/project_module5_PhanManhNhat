export interface UserTs {
  id?: number;

  name?: string;

  password?: string;

  avatar?: string;

  email?: string;

  url?: string;

  description?: string;

  createdate?: Date;

  role?: number;

  birthday?: Date;

  token: string;
}
