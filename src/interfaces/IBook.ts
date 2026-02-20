import { Types } from "mongoose"

/**
 * Represents a book document in the database.
 * Each book is associated with a user (owner) via the `user` field.
 */
interface IBook {
  _id?: Types.ObjectId
  title: string,
  author: string,
  date: Date,
  genre: string[],
  pages: number,
  editorial: string,
  /** Reference to the User who owns this book */
  user: Types.ObjectId
}

export {IBook}