export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'admin' | 'customer';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}