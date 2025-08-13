export interface IUser extends Document {
  _id:string
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'admin' | 'customer';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}


export type Address = {
  division: string;
  district: string;
  postalCode: string;
  phoneNumber: string;
  location: string;
  messOrBasaName: string;
  paraName?: string;
};

export type CustomerDataType = {
  _id: string;
  gender: string;
  profileImage: string;
  address: Address;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
};
export interface TAddress {
  fullName: string;
  phoneNumber: string;
  fullAddress: string;
}