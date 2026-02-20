import { User } from '../models/userModel'
import { Request, Response } from 'express'
import { userValidate, partialUserValidate } from '../validators/userValidate'
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import { config } from 'dotenv'
import { IPayload } from '../interfaces/IPayload'

// Load environment variables
config()

// Secret key used to sign and verify JWT tokens
const JWT_SECRET = process.env.JWT_SECRET as string

/**
 * Handles user registration.
 * Validates the request body with Zod, checks for duplicate emails,
 * hashes the password with bcrypt, and creates a new user in the database.
 *
 * @param req - Express request containing { username, email, password, role } in the body
 * @param res - Express response with success status or error details
 */
const register = async (req: Request, res: Response) => {
  try {
    const body = req.body
    const { email, username, password, role } = body

    // Validate input fields using Zod schema
    const validation = userValidate.safeParse(body)
    
    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error.flatten().fieldErrors })
    } else {
      // Check if a user with the same email already exists
      const foundUser = await User.findOne({ email })
      if (foundUser) {
        return res.status(400).json({success: false, message: "Email already registered, please login with it."})
      } else {
        // Hash the password with a salt factor of 10 before storing
        const hash = await bcryptjs.hash(password, 10)
        const newUser = await User.create({ username, email, password: hash, role })
        return res.status(201).json({success: true, data: "User registered successfully!"})
      }
    }
  } catch (error) {
    const err = error as Error
    return res.status(500).json({success: false, error: err.message})
  }
}

/**
 * Handles user login.
 * Validates credentials, compares the provided password against the stored hash,
 * and returns a signed JWT token (valid for 10 minutes) on success.
 *
 * @param req - Express request containing { email, password } in the body
 * @param res - Express response with JWT token or error details
 */
const login = async (req: Request, res: Response) => {
  try {
    const body = req.body
    const { email, password } = body

    // Validate input fields using Zod schema
    const validation = userValidate.safeParse(body)
    
    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error.flatten().fieldErrors })
    } else {
      // Look up the user by email
      const foundUser = await User.findOne({ email })
      if (!foundUser) {
        return res.status(400).json({success: false, message: "User not found in database."})
      } else {
        // Compare the plain-text password with the stored bcrypt hash
        const validatePassword = await bcryptjs.compare(password, foundUser.password)
        if (!validatePassword) {
          return res.status(400).json({success: false, error: "Invalid login details, please try again"})
        } else {
          // Build the JWT payload with essential user info (no password)
          const payload: IPayload = { _id: foundUser._id, username: foundUser.username, email: foundUser.email, role: foundUser.role }
          // Sign the token with a 10-minute expiration
          const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '10m' })
          return res.status(200).json({success: true, token})
        }
      }
    }
  } catch (error) {
    const err = error as Error
    return res.status(500).json({success: false, error: err.message})
  }
}

export {register, login}