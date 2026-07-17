export interface IUser {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
}