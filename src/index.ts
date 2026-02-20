// ─── Core Dependencies ───
import express, { Request, Response } from "express"
import cors from "cors"
import { config } from "dotenv"

// ─── Internal Modules ───
import { connectDb } from "./config/database"
import { bookRouter } from "./routes/bookRouter"
import { authRouter } from "./routes/authRouter"
import { validateToken } from "./middleware/authMiddleware"

// Load environment variables and establish database connection on startup
config()
connectDb()

const PORT = process.env.PORT

// Initialize Express server
const server = express()

// ─── Global Middleware ───
server.use(cors())              // Enable Cross-Origin Resource Sharing for all origins
server.use(express.json())      // Parse incoming JSON request bodies

// ─── Root Route ───
// Serves a styled HTML landing page with API documentation and endpoint overview
server.get('/', (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>📚 Book Manager API</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Inter', sans-serif;
          background: #0f0f13;
          color: #e4e4e7;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          padding: 40px 20px;
        }
        .container {
          max-width: 720px;
          width: 100%;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        .header .emoji { font-size: 48px; margin-bottom: 12px; }
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(135deg, #a78bfa, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .header p {
          color: #a1a1aa;
          margin-top: 8px;
          font-size: 14px;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.3);
          color: #4ade80;
          padding: 4px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 16px;
        }
        .status-badge .dot {
          width: 7px; height: 7px;
          background: #4ade80;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .card {
          background: #18181b;
          border: 1px solid #27272a;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 20px;
        }
        .card h2 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .endpoint {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: #1e1e22;
          border-radius: 8px;
          margin-bottom: 8px;
          font-size: 13px;
        }
        .endpoint:last-child { margin-bottom: 0; }
        .method {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          min-width: 56px;
          text-align: center;
          flex-shrink: 0;
        }
        .method.get    { background: rgba(34,197,94,0.15); color: #4ade80; }
        .method.post   { background: rgba(59,130,246,0.15); color: #60a5fa; }
        .method.patch  { background: rgba(251,191,36,0.15); color: #fbbf24; }
        .method.delete { background: rgba(239,68,68,0.15);  color: #f87171; }
        .path { font-family: 'Courier New', monospace; color: #d4d4d8; }
        .desc { color: #71717a; margin-left: auto; font-size: 12px; }
        .lock { font-size: 11px; }
        .tech-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .tech-tag {
          background: #1e1e22;
          border: 1px solid #27272a;
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 12px;
          color: #a1a1aa;
        }
        .footer {
          text-align: center;
          color: #52525b;
          font-size: 12px;
          margin-top: 12px;
        }
        .footer a {
          color: #a78bfa;
          text-decoration: none;
        }
        .section-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #52525b;
          margin-bottom: 10px;
          margin-top: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="emoji">📚</div>
          <h1>Book Manager API</h1>
          <p>RESTful API for managing your personal book collection</p>
          <div class="status-badge"><span class="dot"></span> Server Running</div>
        </div>

        <div class="card">
          <h2>🔐 Authentication</h2>
          <p class="section-label">Public — No token required</p>
          <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/api/auth/register</span>
            <span class="desc">Create account</span>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/api/auth/login</span>
            <span class="desc">Get JWT token</span>
          </div>
        </div>

        <div class="card">
          <h2>📖 Books</h2>
          <p class="section-label">Protected — Bearer token required 🔒</p>
          <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/books</span>
            <span class="desc">List all books</span>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/api/books</span>
            <span class="desc">Add a book</span>
          </div>
          <div class="endpoint">
            <span class="method patch">PATCH</span>
            <span class="path">/api/books/:id</span>
            <span class="desc">Update a book</span>
          </div>
          <div class="endpoint">
            <span class="method delete">DELETE</span>
            <span class="path">/api/books/:id</span>
            <span class="desc">Remove a book</span>
          </div>
        </div>

        <div class="card">
          <h2>⚙️ Tech Stack</h2>
          <div class="tech-grid">
            <span class="tech-tag">Express 5</span>
            <span class="tech-tag">TypeScript</span>
            <span class="tech-tag">MongoDB</span>
            <span class="tech-tag">Mongoose</span>
            <span class="tech-tag">JWT</span>
            <span class="tech-tag">bcryptjs</span>
            <span class="tech-tag">Zod</span>
          </div>
        </div>

        <p class="footer">
          Developed by <strong>Fabrizio Caricato</strong> · 
          <a href="https://github.com/fabricaricato/book-management-api" target="_blank">GitHub</a>
        </p>
      </div>
    </body>
    </html>
  `)
})

// ─── API Routes ───
server.use('/api/books', validateToken, bookRouter)  // Protected: requires valid JWT token
server.use('/api/auth', authRouter)                  // Public: register and login endpoints

// Only start the HTTP server when NOT running on Vercel (Vercel handles this via serverless functions)
if (!process.env.VERCEL) {
  server.listen(PORT, () => {
    try {
      console.log(`Server listening on port: ${PORT}`)
    } catch (error) {
      const err = error as Error
      console.log(`Port listening failure, error message: ${err.message}`)
    }
  })
}

// Export the server instance for Vercel serverless function entry point
export default server