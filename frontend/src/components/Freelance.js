import React, { useState } from "react";
import { getContract } from "../utils/contract";
import { ethers } from "ethers";
import axios from "axios";

const API = "http://localhost:5000/api";

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

  const createProject = async () => {
    try {
      setLoading(true);
      setStatus("⏳ Creating project in backend...");
      const res = await axios.post(`${API}/freelance`, { title, freelancerAddress: freelancer });
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
        </>
      )}

      {status && <div className="status-msg">{status}</div>}
    </div>
  );
}
