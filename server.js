import "dotenv/config"
import express from "express"
import githubHandler from "./api/github.js"
import groqHandler from "./api/groq.js"

const app = express()
app.use(express.json())

app.all("/api/github", (req, res) => githubHandler(req, res))
app.all("/api/groq", (req, res) => groqHandler(req, res))

const PORT = process.env.API_PORT || 3001
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
