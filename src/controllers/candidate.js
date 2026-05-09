const candidateModel = require("../models/candidate");

const getAll = async (_req, res) => {
	const filter = { deleted: false };
	const candidates = await candidateModel.find(filter);
	res.status(200).json(candidates);
};

const getById = async (req, res) => {
	const { id } = req.params;
	const filter = { deleted: false, _id: id };
	const candidate = await candidateModel.findOne(filter);
	if (!candidate) {
		return res.status(404).json({ error: "Candidate not found" });
	}
	res.json(candidate);
};

const createCandidate = async (req, res) => {
	const candidate = req.body;
	if (candidate.name === "Jhon Doe") {
		return res.status(403).json({ error: "Not Authorized" });
	}
	const newCandidate = await candidateModel.create(candidate);
	res.json({ status: 1, newCandidate });
};

const deleteCandidate = async (req, res) => {
	const { id } = req.params;
	const filter = { deleted: false, _id: id };

	const candidateDeleted = await candidateModel.findOneAndUpdate(
		filter,
		{ deleted: true },
		{
			returnDocument: "after",
			runValidators: true,
		},
	);
	if (!candidateDeleted) {
		return res.status(404).json({ error: "Candidate not found" });
	}

	res.json({ status: 1, candidateDeleted });
};

const updateCandidate = async (req, res) => {
	const id = req.params.id;
	const newData = req.body;
	// const candidateUpdated = await candidateModel.findByIdAndUpdate(id, {
	// 	$set: newData,
	// });
	const filter = { deleted: false, _id: id };

	const candidateUpdated = await candidateModel.findOneAndUpdate(
		filter,
		newData,
		{ returnDocument: "after", runValidators: true },
	);
	if (!candidateUpdated) {
		return res.status(404).json({ error: "Candidate not found" });
	}

	res.json({ status: 1, candidateUpdated });
};

exports.createCandidate = createCandidate;
exports.updateCandidate = updateCandidate;
exports.deleteCandidate = deleteCandidate;

exports.getAll = getAll;

exports.getById = getById;
