import { model, Schema } from "mongoose"
import { IUser } from "../interfaces/IUser"

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    default: "New User"
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
},
  {
    versionKey: false,
    timestamps: true
  },
  
)

const User = model<IUser>('User', UserSchema)

export { User }