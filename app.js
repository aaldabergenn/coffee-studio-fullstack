const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const currencyRoutes = require("./routes/currencyRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || true,
        credentials: true,
    })
);

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/currency", currencyRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
