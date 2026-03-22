import React, { useState } from "react";
import { getContract } from "../utils/contract";
import { ethers } from "ethers";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function SendMoney() {
  const [addr, setAddr]     = useState("");
  const [amt, setAmt]       = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [txHistory, setTxHistory] = useState([]);

  const send = async () => {
    try {
      setLoading(true);
      setStatus("⏳ Sending transaction...");
      const contract = await getContract();
      const tx = await contract.sendMoney(addr, {
        value: ethers.parseEther(amt)
      });
      await tx.wait();

      // Record in backend
      await axios.post(`${API}/payments/send`, {
        sender: "Your Wallet",
        receiver: addr,
        amount: amt + " ETH"
      });

      setStatus(`✅ Sent ${amt} ETH to ${addr.slice(0, 8)}...`);
      loadHistory();
    } catch (err) {
      setStatus(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await axios.get(`${API}/payments`);
      setTxHistory(res.data);
    } catch {}
  };

  return (
    <div className="module-card">
      <div className="module-icon">💸</div>
      <h2>Remittance</h2>
      <p className="module-desc">Send ETH cross-border instantly via smart contract</p>
      <div className="form-group">
        <label>Recipient Address</label>
        <input
          className="input-field"
          placeholder="0x..."
          value={addr}
          onChange={e => setAddr(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Amount (ETH)</label>
        <input
          className="input-field"
          placeholder="0.01"
          type="number"
          value={amt}
          onChange={e => setAmt(e.target.value)}
        />
      </div>
      <button className="btn-primary" onClick={send} disabled={loading}>
        {loading ? "Sending..." : "Send ETH →"}
      </button>
      {status && <div className="status-msg">{status}</div>}
      {txHistory.length > 0 && (
        <div className="tx-history">
          <h4>Recent Transactions</h4>
          {txHistory.slice(-3).reverse().map(tx => (
            <div key={tx.id} className="tx-item">
              <span>{tx.receiver.slice(0, 10)}...</span>
              <span className="tx-amount">{tx.amount}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
