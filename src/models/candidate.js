const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			maxlength: 20,
			minlength: 4,
		},
		lastname: {
			type: String,
			required: true,
			maxlength: 20,
			minlength: 4,
		},
		email: {
			type: String,
			unique: [true, "No se permite una segunda aplicación"],
			// match: "^[w-.]+@([w-]+.)+[w-]{2,4}$",
		},
		position: {
			type: String,
		},
		status: {
			type: String,
			enum: ["Pending", "In Review", "Interview", "Hiring"],
			default: "Pending",
		},
		appliedAt: {
			type: Date,
			default: Date.now,
		},
		deleted: {
			type: Boolean,
			default: false,
		},
		skills: {
			type: [String],
			default: [],
		},
		linkedIn: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model("candidates", candidateSchema);

// const candidates = [];

// exports.findAll = () => candidates;

// exports.findById = (id) =>
// 	candidates.find((candidate) => candidate.id === Number(id));

// exports.create = (candidate) => {
// 	const newCandidate = {
// 		...candidate,
// 		id: uuid(),
// 		appliedAt: new Date().toISOString(),
// 	};
// 	candidates.push(newCandidate);

// 	return newCandidate;
// };

// exports.update = (id, newData) => {
// 	const index = candidates.findIndex((candidate) => {
// 		return candidate.id === Number(id);
// 	});
// 	if (index !== -1) {
// 		candidates[index] = {
// 			...candidates[index],
// 			...newData,
// 		};
// 		return candidates[index];
// 	} else {
// 		return {};
// 	}
// };

// exports.delete = (id) => {
// 	const index = candidates.findIndex((candidate) => {
// 		return candidate.id === Number(id);
// 	});
// 	if (index !== -1) {
// 		candidates.splice(index, 1);
// 		return true;
// 	} else {
// 		return false;
// 	}
// };
