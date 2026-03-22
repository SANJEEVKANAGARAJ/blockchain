import React, { useState } from "react";
import { getContract } from "../utils/contract";
import { ethers } from "ethers";

export default function Trade() {
  const [sellerAddr, setSellerAddr] = useState("");
  const [amount, setAmount]         = useState("");
  const [orderId, setOrderId]       = useState("");
  const [status, setStatus]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [activeTab, setActiveTab]   = useState("create");

  const createOrder = async () => {
    try {
      setLoading(true);
      setStatus("⏳ Creating escrow order...");
      const contract = await getContract();
      const tx = await contract.createOrder(sellerAddr, {
        value: ethers.parseEther(amount)
      });
      const receipt = await tx.wait();
      setStatus(`✅ Order created! TX: ${receipt.hash.slice(0, 12)}...`);
    } catch (err) {
      setStatus(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelivery = async () => {
    try {
      setLoading(true);
      setStatus("⏳ Confirming delivery and releasing funds...");
      const contract = await getContract();
      const tx = await contract.confirmDelivery(parseInt(orderId));
      await tx.wait();
      setStatus(`✅ Delivery confirmed! Funds released to seller.`);
    } catch (err) {
      setStatus(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="module-card">
      <div className="module-icon">🤝</div>
      <h2>Trade Escrow</h2>
      <p className="module-desc">Secure payments held in escrow until delivery is confirmed</p>

      <div className="tab-group">
        <button className={`tab-btn ${activeTab === "create" ? "active" : ""}`} onClick={() => setActiveTab("create")}>Create Order</button>
        <button className={`tab-btn ${activeTab === "confirm" ? "active" : ""}`} onClick={() => setActiveTab("confirm")}>Confirm Delivery</button>
      </div>

      {activeTab === "create" && (
        <>
          <div className="form-group">
            <label>Seller Address</label>
            <input className="input-field" placeholder="0x..." value={sellerAddr} onChange={e => setSellerAddr(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Amount (ETH)</label>
            <input className="input-field" type="number" placeholder="0.05" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={createOrder} disabled={loading}>
            {loading ? "Processing..." : "🔒 Lock in Escrow"}
          </button>
        </>
      )}

      {activeTab === "confirm" && (
        <>
          <div className="form-group">
            <label>Order ID</label>
            <input className="input-field" type="number" placeholder="0" value={orderId} onChange={e => setOrderId(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={confirmDelivery} disabled={loading}>
            {loading ? "Processing..." : "✅ Confirm & Release Funds"}
          </button>
        </>
      )}

      {status && <div className="status-msg">{status}</div>}
    </div>
  );
}
