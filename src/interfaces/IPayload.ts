import { Types } from "mongoose"

interface IPayload {
  _id?: Types.ObjectId
  username: string,
  email: string,
  role: 'user' | 'admin'
}

export {IPayload}