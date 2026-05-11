const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "candidates",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "jobPostings",
      required: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Interview", "Rejected", "Hired"],
      default: "Applied",
    },
    notes: {
      type: String,
      maxlength: 2000,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

applicationSchema.index({ candidate: 1, job: 1 }, { unique: true });

module.exports = mongoose.model("applications", applicationSchema);
