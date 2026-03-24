import React, { useState } from "react";
import { getContract } from "../utils/contract";
import { ethers } from "ethers";
import RupeeConverter from "./RupeeConverter";

export default function Trade() {
  const [sellerAddr, setSellerAddr] = useState("");
  const [amount, setAmount]         = useState("");
  const [orderId, setOrderId]       = useState("");
  const [status, setStatus]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [activeTab, setActiveTab]   = useState("create");
  const [createdOrders, setCreatedOrders] = useState([]);

  const createOrder = async () => {
    try {
      setLoading(true);
      setStatus("⏳ Creating escrow order...");
      const contract = await getContract();
      const nextOrderId = Number(await contract.orderCount());
      const tx = await contract.createOrder(sellerAddr, {
        value: ethers.parseEther(amount)
      });
      const receipt = await tx.wait();
      setCreatedOrders(prev => [
        {
          id: nextOrderId,
          sellerAddr,
          amount,
          txHash: receipt.hash,
        },
        ...prev,
      ]);
      setOrderId(String(nextOrderId));
      setActiveTab("confirm");
      setStatus(`✅ Order #${nextOrderId} created! Use this order ID to confirm delivery.`);
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
          <RupeeConverter onEthAmount={setAmount} />
          <div className="form-group">
            <label>Amount (ETH)</label>
            <input className="input-field" type="number" placeholder="0.05" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={createOrder} disabled={loading}>
            {loading ? "Processing..." : "🔒 Lock in Escrow"}
          </button>

          {createdOrders.length > 0 && (
            <div className="tx-history">
              <h4>Created Orders</h4>
              {createdOrders.map(order => (
                <div key={order.txHash} className="tx-item">
                  <span>Order #{order.id} • {order.amount} ETH</span>
                  <button className="btn-secondary" onClick={() => {
                    setOrderId(String(order.id));
                    setActiveTab("confirm");
                  }}>
                    Use ID
                  </button>
                </div>
              ))}
            </div>
          )}
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

          {createdOrders.length > 0 && (
            <div className="tx-history">
              <h4>Available Order IDs</h4>
              {createdOrders.map(order => (
                <div key={`confirm-${order.txHash}`} className="tx-item">
                  <span>Order #{order.id} • {order.amount} ETH</span>
                  <button className="btn-secondary" onClick={() => setOrderId(String(order.id))}>
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
