import React, { useState } from "react";

export default function Wallet({ account, setAccount }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const connect = async () => {
    setError(null);

    // MetaMask not installed
    if (!window.ethereum) {
      setError("no_metamask");
      return;
    }

    try {
      setLoading(true);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length === 0) {
        setError("no_accounts");
        return;
      }
      setAccount(accounts[0]);
    } catch (err) {
      // User rejected the request
      if (err.code === 4001) {
        setError("rejected");
      } else {
        setError("unknown");
        console.error("Wallet connect failed:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Demo / mock wallet for testing without MetaMask
  const connectDemo = () => {
    setError(null);
    setAccount("0xDEMO1234567890abcdef1234567890abcdef1234");
  };

  const disconnect = () => {
    setAccount(null);
    setError(null);
  };

  const errorMessages = {
    no_metamask: (
      <span>
        MetaMask not detected.{" "}
        <a href="https://metamask.io/download/" target="_blank" rel="noreferrer" className="wallet-link">
          Install MetaMask ↗
        </a>{" "}
        or use{" "}
        <button className="wallet-demo-link" onClick={connectDemo}>Demo Mode</button>
      </span>
    ),
    rejected: "Connection rejected. Please approve the MetaMask request.",
    no_accounts: "No accounts found in MetaMask.",
    unknown: "Connection failed. Please try again.",
  };

  return (
    <div className="wallet-bar">
      {account ? (
        <div className="wallet-connected">
          <span className="wallet-dot" />
          <span className="wallet-addr">
            {account.startsWith("0xDEMO") ? "🎭 Demo Mode" : `${account.slice(0, 6)}...${account.slice(-4)}`}
          </span>
          <button className="btn-disconnect" onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <div className="wallet-connect-group">
          <button className="btn-connect" onClick={connect} disabled={loading}>
            {loading ? "Connecting..." : "🦊 Connect Wallet"}
          </button>
          <button className="btn-demo" onClick={connectDemo} title="Use a mock wallet for UI testing">
            🎭 Demo
          </button>
          {error && (
            <div className="wallet-error">{errorMessages[error]}</div>
          )}
        </div>
      )}
    </div>
  );
}
