// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title PaymentSystem
/// @notice Cross-border blockchain payments: remittance, trade escrow, freelance milestones, and education payments
contract PaymentSystem {

    // ================= EVENTS =================
    event MoneySent(address indexed from, address indexed to, uint amount);
    event OrderCreated(uint indexed id, address buyer, address seller, uint amount);
    event DeliveryConfirmed(uint indexed id, address buyer, uint amount);
    event MilestoneAdded(uint indexed projectId, uint milestoneId, uint amount);
    event MilestoneReleased(uint indexed projectId, uint milestoneId, address to, uint amount);
    event PaymentWithPurpose(address indexed payer, string purpose, uint amount);

    // ============================================
    // ================= REMITTANCE ==============
    // ============================================

    /// @notice Send ETH directly to a receiver
    function sendMoney(address payable receiver) public payable {
        require(msg.value > 0, "Must send some ETH");
        receiver.transfer(msg.value);
        emit MoneySent(msg.sender, receiver, msg.value);
    }

    // ============================================
    // ================= TRADE (ESCROW) ==========
    // ============================================

    struct Order {
        address buyer;
        address seller;
        uint amount;
        bool delivered;
        bool exists;
    }

    mapping(uint => Order) public orders;
    uint public orderCount;

    /// @notice Buyer creates an escrow order sending ETH to the contract
    function createOrder(address _seller) public payable {
        require(msg.value > 0, "Must send ETH");
        require(_seller != address(0), "Invalid seller");
        orders[orderCount] = Order(msg.sender, _seller, msg.value, false, true);
        emit OrderCreated(orderCount, msg.sender, _seller, msg.value);
        orderCount++;
    }

    /// @notice Buyer confirms delivery, releasing funds to seller
    function confirmDelivery(uint id) public {
        Order storage o = orders[id];
        require(o.exists, "Order does not exist");
        require(msg.sender == o.buyer, "Only buyer can confirm");
        require(!o.delivered, "Already delivered");
        o.delivered = true;
        payable(o.seller).transfer(o.amount);
        emit DeliveryConfirmed(id, msg.sender, o.amount);
    }

    // ============================================
    // ================= FREELANCE ===============
    // ============================================

    struct Milestone {
        uint amount;
        bool completed;
        address payable freelancer;
    }

    mapping(uint => Milestone[]) public projects;

    /// @notice Add a milestone with ETH locked for a freelancer
    function addMilestone(uint projectId, address payable freelancer) public payable {
        require(msg.value > 0, "Milestone must have value");
        projects[projectId].push(Milestone(msg.value, false, freelancer));
        uint milestoneId = projects[projectId].length - 1;
        emit MilestoneAdded(projectId, milestoneId, msg.value);
    }

    /// @notice Release a milestone's payment to the freelancer
    function releaseMilestone(uint projectId, uint milestoneId) public {
        Milestone storage m = projects[projectId][milestoneId];
        require(!m.completed, "Milestone already completed");
        m.completed = true;
        m.freelancer.transfer(m.amount);
        emit MilestoneReleased(projectId, milestoneId, m.freelancer, m.amount);
    }

    /// @notice Get the number of milestones for a project
    function getMilestoneCount(uint projectId) public view returns (uint) {
        return projects[projectId].length;
    }

    // ============================================
    // ================= EDUCATION ===============
    // ============================================

    mapping(address => string[]) public purposes;

    /// @notice Pay with a labeled purpose (e.g., "Tuition", "Books")
    function payWithPurpose(string memory purpose) public payable {
        require(msg.value > 0, "Must send some ETH");
        purposes[msg.sender].push(purpose);
        emit PaymentWithPurpose(msg.sender, purpose, msg.value);
    }

    /// @notice Get all purposes for a given address
    function getPurposes(address user) public view returns (string[] memory) {
        return purposes[user];
    }
}
