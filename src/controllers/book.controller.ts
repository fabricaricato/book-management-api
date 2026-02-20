import { Book } from "../models/bookModel"
import { Request, Response } from 'express'
import { bookValidate, partialBookValidate } from "../validators/bookValidate"
import { IRequestWithUser } from "../interfaces/IRequestWithUser"
import mongoose from "mongoose"

/**
 * Retrieves books from the database with optional query filters.
 * - Regular users can only see their own books.
 * - Admin users can see all books in the database.
 * Supports filtering by author (case-insensitive regex), genre, and minimum page count.
 *
 * @param req - Authenticated request with optional query params: author, genre, minPages
 * @param res - JSON response with the list of matching books
 */
const getBooks = async (req: IRequestWithUser, res: Response) => {
  try {
    const { author, genre, minPages } = req.query
    const filter: any = {}

    // Restrict non-admin users to only see their own books
    if (req.user?.role !== 'admin') {
      filter.user = req.user?._id
    }

    // Optional filter: match author name using case-insensitive regex
    if (author) {
      filter.author = { $regex: author, $options: 'i' }
    }

    // Optional filter: exact genre match
    if (genre) {
      filter.genre = genre
    }

    // Optional filter: books with at least the specified number of pages
    if (minPages) {
      filter.pages = { $gte: Number(minPages) };
    }

    // Query the database and populate the user reference with user details
    const books = await Book.find(filter).populate('user');

    return res.status(200).json({success: true, data: books})
  } catch (error) {
    const err = error as Error
    return res.status(500).json({success: false, error: err.message})
  }
}

/**
 * Creates a new book in the database.
 * Validates the request body with Zod and associates the book
 * with the authenticated user's ID.
 *
 * @param req - Authenticated request with book data in the body
 * @param res - JSON response with the newly created book
 */
const createBook = async (req: IRequestWithUser, res: Response) => {
  try {
    const body = req.body

    // Validate book fields using the Zod schema
    const validation = bookValidate.safeParse(body)

    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error.flatten().fieldErrors })
    } else {

      // Create the book and attach the authenticated user's ID as the owner
      const newBook = await Book.create({
        ...validation.data,
        user: req.user?._id
      })
      
      return res.status(201).json({success: true, data: newBook})
    }
  } catch (error) {
    const err = error as Error
    return res.status(500).json({success: false, error: err.message})
  }
}

/**
 * Updates an existing book by its ID.
 * Uses partial validation (all fields optional) so users can update
 * individual fields. Only the book's owner can perform the update.
 *
 * @param req - Authenticated request with book ID in params and updates in body
 * @param res - JSON response with the updated book or error
 */
const updateBook = async (req: IRequestWithUser, res: Response) => {
  try {
    const id = req.params.id as string
    const updates = req.body

    // Validate partial updates using the partial Zod schema
    const validation = partialBookValidate.safeParse(updates)

    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error.flatten().fieldErrors })
    } else {
      // Verify the provided ID is a valid MongoDB ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: "ID error, please verify your ID input"
        })
      }
      // Find and update the book only if it belongs to the authenticated user
      const updatedBook = await Book.findOneAndUpdate(
        { _id: id, user: req.user?._id },
        validation.data,
        { returnDocument: 'after' }
      )

      if (!updatedBook) {
        return res.status(404).json({ success: false, error: "Book not found or you don't have permission" })
      }

      return res.status(200).json({success: true, data: updatedBook})
    }
  } catch (error) {
    const err = error as Error
    return res.status(500).json({success: false, error: err.message})
  }
}

/**
 * Deletes a book by its ID.
 * Only the book's owner can delete it. Returns the deleted book data on success.
 *
 * @param req - Authenticated request with book ID in params
 * @param res - JSON response with the deleted book or error
 */
const deleteBook = async (req: IRequestWithUser, res: Response) => {
  try {
    const id = req.params.id as string

    // Verify the provided ID is a valid MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "ID error, please verify your ID input"
      })
    } else {
      // Find and delete the book only if it belongs to the authenticated user
      const deletedBook = await Book.findOneAndDelete({ _id: id, user: req.user?._id })

      if (!deletedBook) {
        return res.status(404).json({ success: false, error: "Book not found in database" })
      } else {
        return res.status(201).json({success: true, data: deletedBook})
      }
    }
  } catch (error) {
    const err = error as Error
    return res.status(500).json({success: false, error: err.message})
  }
}

export {getBooks, createBook, updateBook, deleteBook}