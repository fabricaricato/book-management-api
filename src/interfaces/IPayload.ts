import { Types } from "mongoose"

/**
 * Represents the JWT token payload.
 * Contains essential user information embedded in the token
 * for authentication and authorization purposes.
 */
interface IPayload {
  _id?: Types.ObjectId
  username: string,
  email: string,
  /** Determines user permissions: 'user' has limited access, 'admin' has full access */
  role: 'user' | 'admin'
}

export {IPayload}