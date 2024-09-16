import {Schema, Document} from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  securityQuestion: string;
  securityAnswer: string;
}

export const userSchema = new Schema<IUser>(
  {
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: [8, "Password must be at least 8 characters long"]},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    securityQuestion: {type: String, required: true},
    securityAnswer: {type: String, required: true}
  },
  {timestamps: true}
);

export const userSchemaName: string = "User";
