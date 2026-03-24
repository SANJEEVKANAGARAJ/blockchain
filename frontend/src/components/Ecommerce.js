import React, { useEffect, useState } from "react";
import { getContract } from "../utils/contract";
import { api } from "../utils/api";
import { ethers } from "ethers";

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
  const [sellerAddr, setSellerAddr] = useState("");
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const buyProduct = async (product) => {
    try {
      setLoading(product.id);
      setStatus(`⏳ Processing payment for ${product.name}...`);
      const contract = await getContract();
      const nextOrderId = Number(await contract.orderCount());
      const tx = await contract.createOrder(sellerAddr || "0x000000000000000000000000000000000000dEaD", {
        value: ethers.parseEther(product.price)
      });
      await tx.wait();
      setPurchases(prev => [
        {
          id: `${product.id}-${Date.now()}`,
          name: product.name,
          price: product.price,
          orderId: nextOrderId,
        },
        ...prev,
      ]);
      setStatus(`✅ Purchased ${product.name} for ${product.price} ETH! Order #${nextOrderId} is now in escrow.`);
    } catch (err) {
      setStatus(`❌ ${err.message}`);
    } finally {
      setLoading(null);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await api.get("/products");
      if (res.data.length > 0) {
        setProducts(prev => {
          const existingIds = new Set(prev.map(product => product.id));
          const backendProducts = res.data
            .filter(product => !existingIds.has(product.id))
            .map(product => ({ ...product, emoji: "📦" }));
          return [...prev, ...backendProducts];
        });
      }
    } catch (err) {
      console.error("Unable to load backend products:", err);
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

      {purchases.length > 0 && (
        <div className="tx-history">
          <h4>Bought Products</h4>
          {purchases.map(product => (
            <div key={product.id} className="tx-item">
              <span>{product.name} • {product.price} ETH • Order #{product.orderId}</span>
            </div>
          ))}
        </div>
      )}

      {status && <div className="status-msg">{status}</div>}
    </div>
  );
}
