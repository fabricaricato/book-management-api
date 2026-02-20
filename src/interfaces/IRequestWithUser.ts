import { Request } from "express"
import { IPayload } from "./IPayload"

/**
 * Extends the Express Request interface to include user information.
 * After the auth middleware verifies the JWT token, the decoded
 * payload is attached to `req.user` for use in protected route handlers.
 */
export interface IRequestWithUser extends Request {
  user?: IPayload 
}