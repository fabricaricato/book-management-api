import z from "zod"

/**
 * Zod validation schema for creating a new book.
 * Enforces required fields and type constraints:
 * - title: at least 2 characters
 * - author: at least 2 characters
 * - genre: array of 1-5 genre strings
 * - date: coerced to a Date object (accepts string or Date)
 * - pages: optional, must be a positive integer
 * - editorial: optional string
 */
const bookValidate = z.object({
  title: z.string().min(2),
  author: z.string().min(2),
  pages: z.number().int().positive().optional(),
  genre: z.array(z.string()).min(1).max(5),
  date: z.coerce.date(),
  editorial: z.string().optional()
})

/**
 * Partial version of the book schema — all fields become optional.
 * Used for PATCH/update operations where only some fields may be provided.
 */
const partialBookValidate = bookValidate.partial()

export {bookValidate, partialBookValidate}