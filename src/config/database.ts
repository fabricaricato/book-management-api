import { config } from "dotenv"
import { connect } from "mongoose"

// Load environment variables from .env file
config()

// MongoDB connection string from environment variables
const URI_DB = process.env.URI_DB as string

// Ensure the database URI is defined before attempting to connect
if (!URI_DB) {
  throw new Error("❌ Error: The URI_DB variable is missing in the .env")
}

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * Logs the connection status to the console.
 */
const connectDb = async () => {
  try {
    await connect(URI_DB)
    console.log("🟢 CONNECTED SUCCESSFULLY 🟢")
  } catch (error) {
    const err = error as Error
    console.log(`🔴 FAILED TO CONNECT DATABASE 🔴 MESSAGE: ${err.message}`)
  }
}

export {connectDb}