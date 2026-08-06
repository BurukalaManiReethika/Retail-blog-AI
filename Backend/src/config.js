import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const config = {
  // Server
  port: process.env.PORT || 5000,

  // CORS - comma separated list of allowed origins, e.g. "http://localhost:3000,https://myapp.com"
  corsOrigins: (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),

  // Gemini
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",

  // Storage
  dataDir: path.join(__dirname, "..", "data"),
  blogsFile: path.join(__dirname, "..", "data", "blogs.json"),
};
