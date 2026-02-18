import { Request } from "express"
import { IPayload } from "./IPayload"

export interface IRequestWithUser extends Request {
  user?: IPayload 
}