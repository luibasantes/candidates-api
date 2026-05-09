const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			unique: [true, "No se permite una segunda aplicación"],
			trim: true,
			lowercase: true,
			// match: "^[w-.]+@([w-]+.)+[w-]{2,4}$",
		},
		password: {
			type: String,
			required: true,
			minlength: 8,
		},
		deleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model("users", userSchema);
