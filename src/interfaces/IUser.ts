import { Types } from "mongoose"

/**
 * Represents a user document in the database.
 * Used as the TypeScript type for the Mongoose User model.
 */
interface IUser {
  _id?: Types.ObjectId
  username: string,
  email: string,
  /** Stored as a bcrypt hash, never in plain text */
  password: string
  /** Determines access level: 'user' (default) or 'admin' (full access) */
  role: 'user' | 'admin'
}

export {IUser}