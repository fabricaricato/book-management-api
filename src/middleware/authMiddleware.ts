import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { config } from "dotenv"
import { IPayload } from "../interfaces/IPayload"
import { IRequestWithUser } from '../interfaces/IRequestWithUser'

// Load environment variables
config()

// Secret key used to verify JWT tokens
const JWT_SECRET = process.env.JWT_SECRET as string

/**
 * Authentication middleware that validates JWT tokens on protected routes.
 * Extracts the token from the "Authorization: Bearer <token>" header,
 * verifies it against the JWT_SECRET, and attaches the decoded user
 * payload to `req.user` for downstream route handlers.
 *
 * @param req - The incoming request (extended with user payload after validation)
 * @param res - Express response used to send 401/500 errors if validation fails
 * @param next - Calls the next middleware/route handler on successful validation
 */
const validateToken = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
  try {
    // Extract the Authorization header
    const header = req.header('Authorization')

    // Reject if no Authorization header is provided
    if (!header) {
      return res.status(401).json({success: false, message: "Access denied" })
    } else {

      // Ensure the token follows the "Bearer <token>" format
      if (!header.startsWith("Bearer")) {
        return res.status(401).json({ success: false, error: "The token must be in jwt format" })
      } else {
        // Extract the token part after "Bearer "
        const token = header.split(' ')[1]

        // Reject if the token string is empty
        if (!token) {
          return res.status(401).json({ success: false, error: "Invalid token" })
        } else {
          // Verify the token and decode the payload
          const decoded = jwt.verify(token, JWT_SECRET)
          // Attach the decoded user info to the request for use in route handlers
          req.user = decoded as IPayload
          next()
        }
      }
    }
  } catch (error) {
    const err = error as Error
    return res.status(500).json({success: false, error: err.message})
  }
}

export {validateToken}