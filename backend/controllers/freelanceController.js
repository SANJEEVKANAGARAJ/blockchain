let projects = [];

/// @desc Create a new freelance project
exports.createProject = (req, res) => {
  const { title, clientAddress, freelancerAddress } = req.body;
  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }
  const project = {
    id: projects.length,
    title,
    clientAddress: clientAddress || "",
    freelancerAddress: freelancerAddress || "",
    milestones: [],
    createdAt: new Date()
  };
  projects.push(project);
  res.status(201).json(project);
};

/// @desc Get all freelance projects
exports.getProjects = (req, res) => {
  res.json(projects);
};

/// @desc Add a milestone to a project
exports.addMilestone = (req, res) => {
  const id = parseInt(req.params.id);
  const project = projects.find(p => p.id === id);
  if (!project) return res.status(404).json({ error: "Project not found" });

  const { description, amount } = req.body;
  if (!description || !amount) {
    return res.status(400).json({ error: "description and amount are required" });
  }
  const milestone = {
    id: project.milestones.length,
    description,
    amount,
    completed: false,
    createdAt: new Date()
  };
  project.milestones.push(milestone);
  res.status(201).json(milestone);
};
