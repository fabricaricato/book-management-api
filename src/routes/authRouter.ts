import { Router } from "express"
import { register, login } from "../controllers/auth.controller"

/**
 * Authentication router — handles public routes (no token required).
 * POST /register - Create a new user account
 * POST /login    - Authenticate and receive a JWT token
 */
const authRouter = Router()

authRouter.post("/register", register)
authRouter.post("/login", login)


export {authRouter}