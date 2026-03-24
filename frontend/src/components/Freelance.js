import React, { useEffect, useState } from "react";
import { getContract } from "../utils/contract";
import { API_BASE_URL, api } from "../utils/api";
import { ethers } from "ethers";

export default function Freelance() {
  const [title, setTitle]               = useState("");
  const [freelancer, setFreelancer]     = useState("");
  const [projectId, setProjectId]       = useState("");
  const [milestoneAmt, setMilestoneAmt] = useState("");
  const [projectIdRel, setProjectIdRel] = useState("");
  const [milestoneId, setMilestoneId]   = useState("");
  const [status, setStatus]             = useState(null);
  const [loading, setLoading]           = useState(false);
  const [activeTab, setActiveTab]       = useState("create");
  const [projects, setProjects]         = useState([]);
  const [milestones, setMilestones]     = useState([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const createProject = async () => {
    try {
      setLoading(true);
      setStatus("⏳ Creating project in backend...");
      const res = await api.post("/freelance", { title, freelancerAddress: freelancer });
      setProjects(prev => [...prev, res.data]);
      setProjectId(String(res.data.id));
      setProjectIdRel(String(res.data.id));
      setStatus(`✅ Project created! ID: ${res.data.id} — "${res.data.title}"`);
    } catch (err) {
      setStatus(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addMilestone = async () => {
    try {
      setLoading(true);
      setStatus("⏳ Adding milestone to contract...");
      const contract = await getContract();
      const tx = await contract.addMilestone(parseInt(projectId), freelancer, {
        value: ethers.parseEther(milestoneAmt)
      });
      await tx.wait();
      setMilestones(prev => [
        {
          id: prev.filter(m => m.projectId === String(projectId)).length,
          projectId: String(projectId),
          amount: milestoneAmt,
          freelancer,
        },
        ...prev,
      ]);
      setProjectIdRel(String(projectId));
      setMilestoneId(String(milestones.filter(m => m.projectId === String(projectId)).length));
      setStatus(`✅ Milestone added for project ${projectId} — ${milestoneAmt} ETH locked`);
    } catch (err) {
      setStatus(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const releaseMilestone = async () => {
    try {
      setLoading(true);
      setStatus("⏳ Releasing milestone payment...");
      const contract = await getContract();
      const tx = await contract.releaseMilestone(parseInt(projectIdRel), parseInt(milestoneId));
      await tx.wait();
      setStatus(`✅ Milestone ${milestoneId} of project ${projectIdRel} paid out!`);
    } catch (err) {
      setStatus(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const res = await api.get("/freelance");
      setProjects(res.data);
    } catch (err) {
      console.error(`Unable to load freelance projects from ${API_BASE_URL}:`, err);
    }
  };

  return (
    <div className="module-card">
      <div className="module-icon">💼</div>
      <h2>Freelance Milestones</h2>
      <p className="module-desc">Create projects and pay freelancers milestone-by-milestone</p>

      <div className="tab-group">
        {["create", "milestone", "release"].map(t => (
          <button key={t} className={`tab-btn ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
            {t === "create" ? "New Project" : t === "milestone" ? "Add Milestone" : "Release"}
          </button>
        ))}
      </div>

      {activeTab === "create" && (
        <>
          <div className="form-group"><label>Project Title</label>
            <input className="input-field" placeholder="Website Redesign" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="form-group"><label>Freelancer Address</label>
            <input className="input-field" placeholder="0x..." value={freelancer} onChange={e => setFreelancer(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={createProject} disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </button>

          {projects.length > 0 && (
            <div className="tx-history">
              <h4>Existing Projects</h4>
              {projects.map(project => (
                <div key={project.id} className="tx-item">
                  <span>Project #{project.id} • {project.title}</span>
                  <button className="btn-secondary" onClick={() => {
                    setProjectId(String(project.id));
                    setProjectIdRel(String(project.id));
                    setFreelancer(project.freelancerAddress || "");
                    setActiveTab("milestone");
                  }}>
                    Use Project
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "milestone" && (
        <>
          <div className="form-group"><label>Project ID</label>
            <input className="input-field" type="number" placeholder="0" value={projectId} onChange={e => setProjectId(e.target.value)} />
          </div>
          <div className="form-group"><label>Freelancer Address</label>
            <input className="input-field" placeholder="0x..." value={freelancer} onChange={e => setFreelancer(e.target.value)} />
          </div>
          <div className="form-group"><label>Amount (ETH)</label>
            <input className="input-field" type="number" placeholder="0.01" value={milestoneAmt} onChange={e => setMilestoneAmt(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={addMilestone} disabled={loading}>
            {loading ? "Adding..." : "🔒 Lock Milestone"}
          </button>

          {projects.length > 0 && (
            <div className="tx-history">
              <h4>Select a Project</h4>
              {projects.map(project => (
                <div key={`milestone-${project.id}`} className="tx-item">
                  <span>Project #{project.id} • {project.title}</span>
                  <button className="btn-secondary" onClick={() => {
                    setProjectId(String(project.id));
                    setFreelancer(project.freelancerAddress || "");
                  }}>
                    Select
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "release" && (
        <>
          <div className="form-group"><label>Project ID</label>
            <input className="input-field" type="number" placeholder="0" value={projectIdRel} onChange={e => setProjectIdRel(e.target.value)} />
          </div>
          <div className="form-group"><label>Milestone ID</label>
            <input className="input-field" type="number" placeholder="0" value={milestoneId} onChange={e => setMilestoneId(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={releaseMilestone} disabled={loading}>
            {loading ? "Releasing..." : "💰 Release Payment"}
          </button>

          {milestones.length > 0 && (
            <div className="tx-history">
              <h4>Created Milestones</h4>
              {milestones.map(milestone => (
                <div key={`${milestone.projectId}-${milestone.id}`} className="tx-item">
                  <span>Project #{milestone.projectId} • Milestone #{milestone.id}</span>
                  <button className="btn-secondary" onClick={() => {
                    setProjectIdRel(String(milestone.projectId));
                    setMilestoneId(String(milestone.id));
                  }}>
                    Select
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {status && <div className="status-msg">{status}</div>}
    </div>
  );
}
