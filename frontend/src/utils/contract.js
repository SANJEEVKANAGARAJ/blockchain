import { ethers } from "ethers";

// ⚠️ Replace with your deployed contract address after deploying via Remix
const CONTRACT_ADDRESS = "0xC95Ef67AE4D5378f1749E561c8A96135F1C59bbc";
const SEPOLIA_CHAIN_ID = "0xaa36a7";
const SEPOLIA_PARAMS = {
  chainId: SEPOLIA_CHAIN_ID,
  chainName: "Sepolia",
  nativeCurrency: {
    name: "Sepolia ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.sepolia.org"],
  blockExplorerUrls: ["https://sepolia.etherscan.io"],
};

const ABI = [
  // Remittance
  "function sendMoney(address payable receiver) public payable",

  // Trade / Escrow
  "function createOrder(address _seller) public payable",
  "function confirmDelivery(uint id) public",
  "function orderCount() public view returns (uint)",
  "function orders(uint id) public view returns (address buyer, address seller, uint amount, bool delivered, bool exists)",

  // Freelance Milestones
  "function addMilestone(uint projectId, address payable freelancer) public payable",
  "function releaseMilestone(uint projectId, uint milestoneId) public",
  "function getMilestoneCount(uint projectId) public view returns (uint)",

  // Education
  "function payWithPurpose(string memory purpose) public payable",
  "function getPurposes(address user) public view returns (string[] memory)",

  // Events
  "event MoneySent(address indexed from, address indexed to, uint amount)",
  "event OrderCreated(uint indexed id, address buyer, address seller, uint amount)",
  "event DeliveryConfirmed(uint indexed id, address buyer, uint amount)",
  "event MilestoneAdded(uint indexed projectId, uint milestoneId, uint amount)",
  "event MilestoneReleased(uint indexed projectId, uint milestoneId, address to, uint amount)",
  "event PaymentWithPurpose(address indexed payer, string purpose, uint amount)"
];

export const getContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask not found. Please install MetaMask.");
  await ensureSepoliaNetwork();
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
};

export const getProvider = async () => {
  if (!window.ethereum) throw new Error("MetaMask not found.");
  await ensureSepoliaNetwork();
  return new ethers.BrowserProvider(window.ethereum);
};

const ensureSepoliaNetwork = async () => {
  const currentChainId = await window.ethereum.request({ method: "eth_chainId" });

  if (currentChainId === SEPOLIA_CHAIN_ID) {
    return;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_CHAIN_ID }],
    });
  } catch (error) {
    if (error.code !== 4902) {
      throw new Error("Please switch MetaMask to the Sepolia network.");
    }

    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [SEPOLIA_PARAMS],
    });
  }
};
