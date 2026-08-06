import express from "express";
import cors from "cors";
import { config } from "./config.js";

import aiRoutes from "./routes/aiRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

import { errorHandler } from "./middleware/errorHandler.js";
import { startScheduler } from "./services/schedulerService.js";

const app = express();

/**
 * Middlewares
 */
const allowedOrigins = config.corsOrigins.length
    ? config.corsOrigins
    : ["http://localhost:3000"];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use(
    express.json({
        limit: "5mb",
    })
);

app.use(
    express.urlencoded({
        extended: true,
    })
);

/**
 * Health Check
 */
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        service: "Retail Blog AI Backend",
        version: "1.0.0",
        geminiConfigured: !!config.geminiApiKey,
        model: config.geminiModel,
        serverTime: new Date().toISOString(),
    });
});

/**
 * Routes
 */
app.use("/api/ai", aiRoutes);
app.use("/api/blogs", blogRoutes);

/**
 * Unknown Routes
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API Route Not Found",
    });
});

/**
 * Global Error Handler
 */
app.use(errorHandler);

/**
 * Start Server
 */
app.listen(config.port, () => {
    console.clear();

    console.log("=========================================");
    console.log(" Retail Blog AI Backend");
    console.log("=========================================");
    console.log(` Server : http://localhost:${config.port}`);
    console.log(` Health : http://localhost:${config.port}/api/health`);
    console.log(` Gemini : ${config.geminiApiKey ? "Configured" : "Missing API Key"}`);
    console.log(` Model  : ${config.geminiModel}`);
    console.log("=========================================");

    startScheduler();
});
