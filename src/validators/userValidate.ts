import z from "zod"

const userValidate = z.object({
  username: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(["user", "admin"]).optional()
})

const partialUserValidate = userValidate.partial()

export {userValidate, partialUserValidate}