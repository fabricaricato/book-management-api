import z from "zod";

const bookValidate = z.object({
  title: z.string().min(2),
  author: z.string().min(2),
  pages: z.number().int().positive().optional(),
  genre: z.array(z.string()).min(1).max(5),
  date: z.coerce.date(),
  editorial: z.string().optional()
})

const partialBookValidate = bookValidate.partial()

export {bookValidate, partialBookValidate}