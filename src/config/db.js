const mongoose = require("mongoose");

const MONGO_DB_URI = process.env.MONGO_DB_URI;

const connectDB = async () => {
	try {
		await mongoose.connect(MONGO_DB_URI);
		console.log("✅ Conexión exitosa a la DB");
	} catch (error) {
		console.log("connectDB ~ error:", error);
		process.exit(1);
	}
};

module.exports = connectDB;
