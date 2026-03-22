# ⛓️ ChainPay — Cross-Border Blockchain Payment System

A full-stack DApp combining Solidity smart contracts, a Node.js/Express backend, and a React frontend with a premium dark-mode UI.

---

## 📁 Project Structure

```
blockchain/
├── smart-contract/
│   └── PaymentSystem.sol      # All 4 payment modules in one contract
├── backend/
│   ├── server.js              # Express server (port 5000)
│   ├── controllers/           # Business logic (in-memory)
│   └── routes/                # REST API routes
├── frontend/
│   └── src/
│       ├── App.js             # Tabbed UI (5 modules)
│       ├── App.css            # Premium dark-mode styling
│       ├── components/        # One component per module
│       └── utils/contract.js  # ethers.js contract helper
└── README.md
```

---

## 🚀 How to Run

### 1️⃣ Deploy the Smart Contract

1. Open [Remix IDE](https://remix.ethereum.org)
2. Upload `smart-contract/PaymentSystem.sol`
3. Compile with Solidity **0.8.x**
4. Deploy to a testnet (e.g. Sepolia) using MetaMask
5. Copy the deployed **contract address**
6. Paste it in `frontend/src/utils/contract.js` → `CONTRACT_ADDRESS`

### 2️⃣ Start the Backend

```bash
cd backend
npm install       # Already done
npm start         # Runs on http://localhost:5000
```

**API Endpoints:**

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/payments/send` | Log a payment |
| GET | `/api/payments` | List transactions |
| POST | `/api/products` | Add a product |
| GET | `/api/products` | List products |
| POST | `/api/freelance` | Create a project |
| POST | `/api/freelance/:id/milestones` | Add a milestone |

### 3️⃣ Start the Frontend

```bash
cd frontend
npm start         # Runs on http://localhost:3000
```

---

## 🔗 Smart Contract Modules

| Module | Function | Description |
|--------|----------|-------------|
| 💸 Remittance | `sendMoney(receiver)` | Direct ETH transfer |
| 🤝 Trade Escrow | `createOrder(seller)` + `confirmDelivery(id)` | Funds held until delivery |
| 💼 Freelance | `addMilestone(projectId, freelancer)` + `releaseMilestone(...)` | Milestone-based payments |
| 🎓 Education | `payWithPurpose(purpose)` | Tagged fee payment |

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Smart Contract | Solidity 0.8, Remix IDE |
| Blockchain | Ethereum (Sepolia Testnet) |
| Wallet | MetaMask + ethers.js v6 |
| Backend | Node.js, Express |
| Frontend | React (CRA), CSS3 |

---

## ⚠️ Notes

- The app works in **read-only UI mode** without MetaMask.
- All blockchain transactions require a deployed contract address in `contract.js`.
- Backend uses **in-memory storage** — data resets on server restart.
