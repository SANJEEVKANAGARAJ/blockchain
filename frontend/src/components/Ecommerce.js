import React, { useState } from "react";
import { getContract } from "../utils/contract";
import { ethers } from "ethers";
import axios from "axios";

const API = "http://localhost:5000/api";

const DEMO_PRODUCTS = [
  { id: 1, name: "Wireless Headphones", price: "0.02", description: "Premium noise-cancelling", emoji: "🎧" },
  { id: 2, name: "Mechanical Keyboard", price: "0.01", description: "RGB backlit, tactile switches", emoji: "⌨️" },
  { id: 3, name: "4K Webcam",           price: "0.015", description: "HD streaming quality", emoji: "📷" },
  { id: 4, name: "Standing Desk",       price: "0.05", description: "Ergonomic adjustable", emoji: "🖥️" },
];

export default function Ecommerce() {
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [status, setStatus]     = useState(null);
  const [loading, setLoading]   = useState(null);
  const [newName, setNewName]   = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [sellerAddr, setSellerAddr] = useState("");

  const buyProduct = async (product) => {
    try {
      setLoading(product.id);
      setStatus(`⏳ Processing payment for ${product.name}...`);
      const contract = await getContract();
      const tx = await contract.createOrder(sellerAddr || "0x000000000000000000000000000000000000dEaD", {
        value: ethers.parseEther(product.price)
      });
      await tx.wait();
      setStatus(`✅ Purchased ${product.name} for ${product.price} ETH! Funds in escrow.`);
    } catch (err) {
      setStatus(`❌ ${err.message}`);
    } finally {
      setLoading(null);
    }
  };

  const addProduct = async () => {
    try {
      const res = await axios.post(`${API}/products`, { name: newName, price: newPrice });
      setProducts(prev => [...prev, { ...res.data, emoji: "📦" }]);
      setNewName(""); setNewPrice("");
      setStatus(`✅ "${newName}" added to catalog`);
    } catch (err) {
      setStatus(`❌ ${err.message}`);
    }
  };

  return (
    <div className="module-card">
      <div className="module-icon">🛒</div>
      <h2>E-Commerce Checkout</h2>
      <p className="module-desc">Buy products using crypto with escrow protection</p>

      <div className="form-group">
        <label>Seller Wallet Address (for escrow)</label>
        <input className="input-field" placeholder="0x seller address..." value={sellerAddr} onChange={e => setSellerAddr(e.target.value)} />
      </div>

      <div className="product-grid">
        {products.map(p => (
          <div key={p.id} className="product-card">
            <div className="product-emoji">{p.emoji || "📦"}</div>
            <div className="product-name">{p.name}</div>
            <div className="product-price">{p.price} ETH</div>
            <div className="product-desc">{p.description}</div>
            <button className="btn-buy" onClick={() => buyProduct(p)} disabled={loading === p.id}>
              {loading === p.id ? "Buying..." : "Buy Now"}
            </button>
          </div>
        ))}
      </div>

      <div className="add-product">
        <h4>Add Product to Backend Catalog</h4>
        <div className="form-row">
          <input className="input-field" placeholder="Product name" value={newName} onChange={e => setNewName(e.target.value)} />
          <input className="input-field" placeholder="Price (ETH)" value={newPrice} onChange={e => setNewPrice(e.target.value)} />
          <button className="btn-secondary" onClick={addProduct}>Add</button>
        </div>
      </div>

      {status && <div className="status-msg">{status}</div>}
    </div>
  );
}
