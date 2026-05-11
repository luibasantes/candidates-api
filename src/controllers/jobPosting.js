const jobPostingModel = require("../models/jobPosting");
const applicationModel = require("../models/application");

const getAll = async (_req, res) => {
  const jobs = await jobPostingModel.find({ deleted: false });
  res.status(200).json(jobs);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const job = await jobPostingModel.findOne({ _id: id, deleted: false });
  if (!job) {
    return res.status(404).json({ error: "Job posting not found" });
  }
  res.json(job);
};

const createJob = async (req, res) => {
  const newJob = await jobPostingModel.create(req.body);
  res.status(201).json({ status: 1, newJob });
};

const updateJob = async (req, res) => {
  const { id } = req.params;
  const filter = { _id: id, deleted: false };
  const jobUpdated = await jobPostingModel.findOneAndUpdate(filter, req.body, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!jobUpdated) {
    return res.status(404).json({ error: "Job posting not found" });
  }
  res.json({ status: 1, jobUpdated });
};

const deleteJob = async (req, res) => {
  const { id } = req.params;
  const filter = { _id: id, deleted: false };
  const jobDeleted = await jobPostingModel.findOneAndUpdate(
    filter,
    { deleted: true },
    { returnDocument: "after", runValidators: true },
  );
  if (!jobDeleted) {
    return res.status(404).json({ error: "Job posting not found" });
  }
  res.json({ status: 1, jobDeleted });
};

const getMatches = async (req, res) => {
  const { id } = req.params;
  const { status } = req.query;

  const job = await jobPostingModel.findOne({ _id: id, deleted: false });
  if (!job) {
    return res.status(404).json({ error: "Job posting not found" });
  }

  const filter = { job: id, deleted: false };
  if (status) filter.status = status;

  const applications = await applicationModel
    .find(filter)
    .populate({ path: "candidate", match: { deleted: false } });

  const required = new Set(job.requiredSkills || []);
  const totalRequired = required.size || 1;

  const matches = applications
    .filter((a) => a.candidate)
    .map((a) => {
      const candidateSkills = a.candidate.skills || [];
      const matchedSkills = candidateSkills.filter((s) => required.has(s));
      return {
        application: {
          _id: a._id,
          status: a.status,
          appliedAt: a.appliedAt,
          notes: a.notes,
        },
        candidate: a.candidate,
        score: matchedSkills.length / totalRequired,
        matchedSkills,
      };
    })
    .sort((a, b) => b.score - a.score);

  res.json({ job, matches });
};

exports.getAll = getAll;
exports.getById = getById;
exports.createJob = createJob;
exports.updateJob = updateJob;
exports.deleteJob = deleteJob;
exports.getMatches = getMatches;
