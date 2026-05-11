const express = require("express");
const candidateController = require("../controllers/candidate");

const router = express.Router();

// /candidates/all
router.get("/", candidateController.getAll);
// /candidates/:id/matches
router.get("/:id/matches", candidateController.getMatches);
// /candidates/one/:id
router.get("/:id", candidateController.getById);
// /candidates/
router.post("/", candidateController.createCandidate);
// /candidates/:id
router.delete("/:id", candidateController.deleteCandidate);
// /candidates/:id
router.put("/:id", candidateController.updateCandidate);

module.exports = router;
