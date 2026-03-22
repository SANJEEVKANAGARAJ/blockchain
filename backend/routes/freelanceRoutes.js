const router = require("express").Router();
const {
  createProject,
  getProjects,
  addMilestone
} = require("../controllers/freelanceController");

router.get("/", getProjects);
router.post("/", createProject);
router.post("/:id/milestones", addMilestone);

module.exports = router;
