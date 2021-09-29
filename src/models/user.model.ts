import mongoose from "mongoose";


export interface UserDocument extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  password: string;
  role: string;
  status?:boolean;
  createdAt: Date;
  updatedAt: Date;
  
}

const UserSchema = new mongoose.Schema(
  {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: { type: String, required: true, unique: true },
    countryCode: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true,enum: ['super_admin','admin','user'] },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;
