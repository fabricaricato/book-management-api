import { model, Schema } from "mongoose"
import { IUser } from "../interfaces/IUser"

/**
 * Mongoose schema definition for the User collection.
 * Includes timestamps for createdAt/updatedAt tracking.
 */
const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    default: "New User"   // Default name assigned if none is provided
  },
  email: {
    type: String,
    required: true,
    unique: true          // Enforces unique email addresses at the database level
  },
  password: {
    type: String,
    required: true        // Stored as a bcrypt hash (hashing happens in the controller)
  },
  role: {
    type: String,
    enum: ["user", "admin"],  // Only these two values are allowed
    default: "user"           // New users default to the 'user' role
  }
},
  {
    versionKey: false,  // Disable the __v version field on documents
    timestamps: true    // Automatically adds createdAt and updatedAt fields
  },
  
)

/** Mongoose model for performing CRUD operations on the User collection */
const User = model<IUser>('User', UserSchema)

export { User }