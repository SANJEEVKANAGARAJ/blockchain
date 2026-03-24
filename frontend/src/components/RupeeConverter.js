import React, { useState, useEffect, useRef } from "react";

// Fallback ETH price in INR if API fails
const FALLBACK_ETH_INR = 250000;

export default function RupeeConverter({ onEthAmount }) {
  const [inr, setInr]           = useState("");
  const [ethPrice, setEthPrice] = useState(FALLBACK_ETH_INR);
  const [eth, setEth]           = useState(null);
  const [priceAge, setPriceAge] = useState(null);
  const [fetching, setFetching] = useState(false);
  const debounceRef             = useRef(null);

  // Fetch live ETH/INR price on mount
  useEffect(() => {
    const fetchPrice = async () => {
      setFetching(true);
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr"
        );
        if (res.ok) {
          const data = await res.json();
          if (data?.ethereum?.inr) {
            setEthPrice(data.ethereum.inr);
            setPriceAge(new Date());
          }
        }
      } catch (_) {
        // silently use fallback
      } finally {
        setFetching(false);
      }
    };
    fetchPrice();
  }, []);

  // Recompute ETH whenever INR input or price changes
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!inr || isNaN(Number(inr)) || Number(inr) <= 0) {
      setEth(null);
      return;
    }
    debounceRef.current = setTimeout(() => {
      const ethVal = (Number(inr) / ethPrice).toFixed(8);
      setEth(ethVal);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [inr, ethPrice]);

  const handleUse = () => {
    if (eth && onEthAmount) onEthAmount(eth);
  };

  return (
    <div className="rupee-converter">
      <div className="rupee-converter-header">
        <span className="rupee-icon">₹</span>
        <span className="rupee-title">Pay in Rupees</span>
        {fetching && <span className="rupee-fetching">Fetching live price…</span>}
        {!fetching && priceAge && (
          <span className="rupee-rate">
            1 ETH ≈ ₹{ethPrice.toLocaleString("en-IN")}
          </span>
        )}
      </div>

      <div className="rupee-row">
        <div className="rupee-input-wrap">
          <span className="rupee-prefix">₹</span>
          <input
            className="input-field rupee-input"
            type="number"
            placeholder="Enter amount in Rupees"
            value={inr}
            min="0"
            onChange={e => setInr(e.target.value)}
          />
        </div>

        {eth !== null && (
          <>
            <div className="rupee-arrow">→</div>
            <div className="rupee-result">
              <span className="rupee-eth-val">{eth}</span>
              <span className="rupee-eth-unit">ETH</span>
            </div>
            <button className="btn-use-eth" onClick={handleUse} title="Use this ETH amount in the transaction field">
              Use ↗
            </button>
          </>
        )}
      </div>

      {eth !== null && (
        <div className="rupee-hint">
          ₹{Number(inr).toLocaleString("en-IN")} ≈ <strong>{eth} ETH</strong> at current market rate. Click <em>Use ↗</em> to fill the amount field.
        </div>
      )}
    </div>
  );
}
