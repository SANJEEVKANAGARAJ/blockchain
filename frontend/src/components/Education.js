import React, { useState } from "react";
import { getContract } from "../utils/contract";
import { ethers } from "ethers";

const PURPOSES = ["Tuition Fee", "Online Course", "Textbooks", "Exam Fee", "Scholarship", "Workshop"];

export default function Education() {
  const [purpose, setPurpose] = useState("");
  const [customPurpose, setCustomPurpose] = useState("");
  const [amount, setAmount]   = useState("");
  const [status, setStatus]   = useState(null);
  const [loading, setLoading] = useState(false);

  const pay = async () => {
    try {
      setLoading(true);
      const label = purpose === "custom" ? customPurpose : purpose;
      if (!label) { setStatus("❌ Please select a purpose"); return; }
      setStatus(`⏳ Sending education payment for "${label}"...`);
      const contract = await getContract();
      const tx = await contract.payWithPurpose(label, {
        value: ethers.parseEther(amount)
      });
      await tx.wait();
      setStatus(`✅ Payment of ${amount} ETH sent for "${label}"`);
    } catch (err) {
      setStatus(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="module-card">
      <div className="module-icon">🎓</div>
      <h2>Education Payments</h2>
      <p className="module-desc">Pay tuition and education fees with purpose tags on-chain</p>

      <div className="purpose-grid">
        {PURPOSES.map(p => (
          <button
            key={p}
            className={`purpose-chip ${purpose === p ? "active" : ""}`}
            onClick={() => setPurpose(p)}
          >{p}</button>
        ))}
        <button
          className={`purpose-chip ${purpose === "custom" ? "active" : ""}`}
          onClick={() => setPurpose("custom")}
        >✏️ Custom</button>
      </div>

      {purpose === "custom" && (
        <div className="form-group">
          <label>Custom Purpose</label>
          <input className="input-field" placeholder="e.g. Research Grant" value={customPurpose} onChange={e => setCustomPurpose(e.target.value)} />
        </div>
      )}

      <div className="form-group">
        <label>Amount (ETH)</label>
        <input
          className="input-field"
          type="number"
          placeholder="0.005"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
      </div>

      <button className="btn-primary" onClick={pay} disabled={loading || !purpose}>
        {loading ? "Processing..." : "🎓 Pay Education Fee"}
      </button>
      {status && <div className="status-msg">{status}</div>}
    </div>
  );
}
