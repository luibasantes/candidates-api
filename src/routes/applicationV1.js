const express = require("express");
const applicationController = require("../controllers/application");

const router = express.Router();

router.get("/", applicationController.getAll);
router.post("/", applicationController.createApplication);
router.get("/:id", applicationController.getById);
router.put("/:id", applicationController.updateApplication);
router.delete("/:id", applicationController.deleteApplication);

module.exports = router;
