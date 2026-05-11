const mongoose = require("mongoose");

const jobPostingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 100,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 5000,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      trim: true,
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
    },
    salaryMin: {
      type: Number,
      min: 0,
    },
    salaryMax: {
      type: Number,
      min: 0,
      validate: {
        validator: function (v) {
          return this.salaryMin == null || v == null || v >= this.salaryMin;
        },
        message: "salaryMax must be greater than or equal to salaryMin",
      },
    },
    status: {
      type: String,
      enum: ["Open", "Closed", "Draft"],
      default: "Open",
    },
    postedAt: {
      type: Date,
      default: Date.now,
    },
    closedAt: {
      type: Date,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("jobPostings", jobPostingSchema);
