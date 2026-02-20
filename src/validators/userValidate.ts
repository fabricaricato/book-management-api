import z from "zod"

/**
 * Zod validation schema for user registration and login.
 * Enforces required fields and constraints:
 * - username: at least 2 characters
 * - email: must be a valid email format
 * - password: at least 6 characters
 * - role: optional, defaults to 'user' if not specified (set in the model)
 */
const userValidate = z.object({
  username: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(["user", "admin"]).optional()
})

/**
 * Partial version of the user schema — all fields become optional.
 * Can be used for profile update operations.
 */
const partialUserValidate = userValidate.partial()

export {userValidate, partialUserValidate}