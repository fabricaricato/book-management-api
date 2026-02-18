import { config } from "dotenv"
import { connect } from "mongoose"
config()

const URI_DB = process.env.URI_DB as string

if (!URI_DB) {
  throw new Error("❌ Error: The URI_DB variable is missing in the .env")
}

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