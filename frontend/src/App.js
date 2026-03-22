import React, { useState, useEffect } from "react";
import Wallet from "./components/Wallet";
import SendMoney from "./components/SendMoney";
import Trade from "./components/Trade";
import Freelance from "./components/Freelance";
import Ecommerce from "./components/Ecommerce";
import Education from "./components/Education";
import "./App.css";

const TABS = [
  { id: "remittance", label: "💸 Remittance",  Component: SendMoney },
  { id: "trade",      label: "🤝 Trade",        Component: Trade      },
  { id: "freelance",  label: "💼 Freelance",    Component: Freelance  },
  { id: "ecommerce",  label: "🛒 E-Commerce",   Component: Ecommerce  },
  { id: "education",  label: "🎓 Education",    Component: Education  },
];

function App() {
  const [account, setAccount] = useState(null);
  const [activeTab, setActiveTab] = useState("remittance");

  // Listen for MetaMask account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", accounts => {
        setAccount(accounts[0] || null);
      });
    }
  }, []);

  const ActiveComponent = TABS.find(t => t.id === activeTab)?.Component;

  return (
    <div className="app">
      {/* Animated background blobs */}
      <div className="bg-blob blob1" />
      <div className="bg-blob blob2" />
      <div className="bg-blob blob3" />

      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">⛓️</span>
            <div>
              <div className="logo-title">ChainPay</div>
              <div className="logo-sub">Cross-Border Blockchain Payments</div>
            </div>
          </div>
          <Wallet account={account} setAccount={setAccount} />
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <h1>Borderless Payments<br /><span className="gradient-text">Powered by Blockchain</span></h1>
        <p>Send money, trade goods, pay freelancers, shop online, and fund education — all with crypto, globally.</p>
        <div className="stats-row">
          {[["$0 Fees","No bank charges"],["⚡ Instant","Real-time settlement"],["🔒 Secure","Smart contract escrow"],["🌍 Global","No borders"]].map(([a,b]) => (
            <div key={a} className="stat-card"><div className="stat-val">{a}</div><div className="stat-label">{b}</div></div>
          ))}
        </div>
      </section>

      {/* Wallet warning banner */}
      {!account && (
        <div className="wallet-banner">
          🦊 Connect your MetaMask wallet above to use blockchain features
        </div>
      )}

      {/* Module Tabs */}
      <main className="main-content">
        <nav className="tab-nav">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="module-container">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>⛓️ ChainPay — Built on Ethereum • Smart Contracts by Solidity • Powered by ethers.js</p>
        <p className="footer-warning">⚠️ Testnet only — Deploy contract via Remix IDE before use</p>
      </footer>
    </div>
  );
}

export default App;
