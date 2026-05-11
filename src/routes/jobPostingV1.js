const express = require("express");
const jobController = require("../controllers/jobPosting");

const router = express.Router();

router.get("/", jobController.getAll);
router.post("/", jobController.createJob);
router.get("/:id/matches", jobController.getMatches);
router.get("/:id", jobController.getById);
router.put("/:id", jobController.updateJob);
router.delete("/:id", jobController.deleteJob);

module.exports = router;
