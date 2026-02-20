import { Router } from "express"
import { createBook, deleteBook, getBooks, updateBook } from "../controllers/book.controller"

/**
 * Book router — all routes are protected by the auth middleware (applied in index.ts).
 * GET    /         - List books (own books for users, all books for admins)
 * POST   /         - Create a new book (associated with the authenticated user)
 * PATCH  /:id      - Update a book by ID (only the owner can update)
 * DELETE /:id      - Delete a book by ID (only the owner can delete)
 */
const bookRouter = Router()

bookRouter.get("/", getBooks)
bookRouter.post("/", createBook)
bookRouter.patch("/:id", updateBook)
bookRouter.delete("/:id", deleteBook)

export {bookRouter}