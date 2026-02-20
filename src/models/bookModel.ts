import { model, Schema } from "mongoose"
import { IBook } from "../interfaces/IBook"

/**
 * Mongoose schema definition for the Book collection.
 * Defines the structure, types, and constraints for book documents.
 */
const BookSchema = new Schema<IBook>({
  title: {
    type: String,
    trim: true,
    required: true
  },
  author: {
    type: String,
    trim: true,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  genre: {
    type: [String],
    required: true,
    trim: true
  },
  pages: {
    type: Number,
    min: 1          // Pages must be at least 1
  },
  editorial: {
    type: String,
    trim: true
  },
  /** Reference to the User who created this book (enables .populate('user')) */
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  versionKey: false  // Disable the __v version field on documents
})

/** Mongoose model for performing CRUD operations on the Book collection */
const Book = model<IBook>('Book', BookSchema)

export {Book}