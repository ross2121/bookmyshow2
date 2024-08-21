import express from "express";
import mongoose from "mongoose";
import connectDB from "./db/connect.js";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import adminroutes from "./routes/admin.js";
import cinemaroute from "./routes/cinema.js";
import movieroute from "./routes/movie.js";
import customerroutes from "./routes/customer.js";
import managerroutes from "./routes/manager.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsconfig = {
    credentials: true,
    origin: true,
};
app.use(cors(corsconfig));
app.use(cors({
    origin: 'http://localhost:3000', // Adjust this as needed
    credentials: true
}));
app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultsecret', // Use environment variable for secret
    resave:false,
    saveUninitialized: true,
    // store:sessionStorage,
    cookie: { secure: process.env.NODE_ENV === 'production' }, // Use secure cookies in production
}));

// Routes
app.use("/api/customer", customerroutes);
app.use("/api/cinema", cinemaroute);
app.use("/api/movie", movieroute);
app.use("/api/admin", adminroutes);
app.use("/api/manager", managerroutes);

// Error handling middleware
app.use((err, req, res, next) => {
    if (res.headersSent) {
        // If headers are already sent, delegate to default error handler
        return next(err);
    }
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message,
    });
});

// Start server
const start = async () => {
    try {
        mongoose.set("strictQuery", false);
        await connectDB(process.env.MONGO_URL);
        app.listen(port, () => {
            console.log(`Server is running at ${port}`);
        });
    } catch (error) {
        console.error("Error starting the server:", error);
    }
};

start();
