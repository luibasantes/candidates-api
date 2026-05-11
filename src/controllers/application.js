const applicationModel = require("../models/application");
const candidateModel = require("../models/candidate");
const jobPostingModel = require("../models/jobPosting");

const getAll = async (req, res) => {
  const filter = { deleted: false };
  if (req.query.candidate) filter.candidate = req.query.candidate;
  if (req.query.job) filter.job = req.query.job;
  if (req.query.status) filter.status = req.query.status;

  const applications = await applicationModel
    .find(filter)
    .populate("candidate")
    .populate("job");
  res.json(applications);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const application = await applicationModel
    .findOne({ _id: id, deleted: false })
    .populate("candidate")
    .populate("job");
  if (!application) {
    return res.status(404).json({ error: "Application not found" });
  }
  res.json(application);
};

const createApplication = async (req, res) => {
  const { candidate, job, status, notes } = req.body;

  const candidateExists = await candidateModel.findOne({
    _id: candidate,
    deleted: false,
  });
  if (!candidateExists) {
    return res.status(404).json({ error: "Candidate not found" });
  }

  const jobExists = await jobPostingModel.findOne({
    _id: job,
    deleted: false,
  });
  if (!jobExists) {
    return res.status(404).json({ error: "Job posting not found" });
  }

  try {
    const application = await applicationModel.create({
      candidate,
      job,
      status,
      notes,
    });
    res.status(201).json({ status: 1, application });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ error: "Candidate already applied to this job" });
    }
    throw err;
  }
};

const UPDATABLE_FIELDS = ["status", "notes"];

const updateApplication = async (req, res) => {
  const { id } = req.params;
  const update = {};
  for (const field of UPDATABLE_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      update[field] = req.body[field];
    }
  }
  if (Object.keys(update).length === 0) {
    return res.status(400).json({
      error: `No updatable fields provided. Allowed: ${UPDATABLE_FIELDS.join(", ")}`,
    });
  }

  const filter = { _id: id, deleted: false };
  const applicationUpdated = await applicationModel.findOneAndUpdate(
    filter,
    update,
    { returnDocument: "after", runValidators: true },
  );
  if (!applicationUpdated) {
    return res.status(404).json({ error: "Application not found" });
  }
  res.json({ status: 1, applicationUpdated });
};

const deleteApplication = async (req, res) => {
  const { id } = req.params;
  const filter = { _id: id, deleted: false };
  const applicationDeleted = await applicationModel.findOneAndUpdate(
    filter,
    { deleted: true },
    { returnDocument: "after", runValidators: true },
  );
  if (!applicationDeleted) {
    return res.status(404).json({ error: "Application not found" });
  }
  res.json({ status: 1, applicationDeleted });
};

exports.getAll = getAll;
exports.getById = getById;
exports.createApplication = createApplication;
exports.updateApplication = updateApplication;
exports.deleteApplication = deleteApplication;
