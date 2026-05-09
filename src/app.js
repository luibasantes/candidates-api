const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const candidateRoutes = require("./routes/candidateV1");

const passport = require("./middlewares/auth");
const errorHandlerMiddleware = require("./middlewares/errorHandler");
const requestTimerMiddleware = require("./middlewares/requestTimer");
// const loggerMiddleware = require("./middlewares/logger");

connectDB();
const app = express();

// Limiter general para toda la API
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	max: 100,
	message: {
		status: 429,
		message: "Demasiadas peticiones",
	},
});

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(requestTimerMiddleware);
// app.use(loggerMiddleware);
app.use(limiter);
app.use(passport.initialize());

app.use("/api/v1/auth", authRoutes);

app.use(
	"/api/v1/candidates",
	passport.authenticate("jwt", { session: false }),
	candidateRoutes,
);

app.use(errorHandlerMiddleware);

module.exports = app;
