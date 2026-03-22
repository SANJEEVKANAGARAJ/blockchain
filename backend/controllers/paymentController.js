let transactions = [];

/// @desc Send a payment (recorded off-chain)
exports.sendPayment = (req, res) => {
  const { sender, receiver, amount } = req.body;
  if (!sender || !receiver || !amount) {
    return res.status(400).json({ error: "sender, receiver, and amount are required" });
  }
  const tx = { id: transactions.length + 1, sender, receiver, amount, date: new Date() };
  transactions.push(tx);
  res.status(201).json(tx);
};

/// @desc Get all payment transactions
exports.getTransactions = (req, res) => {
  res.json(transactions);
};
