# Web3 Task Platform

## Overview
This Web3-based platform enables users to post tasks and complete tasks in exchange for blockchain-based payments. The primary use case focuses on **YouTube thumbnail selection tasks**, where users upload multiple variants of a thumbnail, and workers vote on the best-performing option to optimize **Click-Through Rates (CTR)**.

The platform is **completely decentralized**, leveraging the **Solana blockchain** for payments and authentication. Users sign in via their wallets, eliminating the need for Web2-based authentication.

## Live Link

**https://thumboost.vercel.app**

## Key Features

### 🔗 Wallet-Based Authentication
- Users connect their **Solana wallet** to sign in.
- No traditional email/password login—**Web3-only authentication**.
- Secure authentication using **signMessage()** for verification.

### 📝 Task Creation & Bidding
- Users post tasks, specifying a **reward in SOL**.
- Tasks include **multiple thumbnail options**.
- Workers select the best thumbnail based on their judgment.

### 💰 Decentralized Payments
- Payments are **locked in a smart contract** when the task is created.
- Workers receive payments once they submit their selections.
- **No middleman**, instant and secure transactions.

### ⭐ Reputation & Staking System
- Workers **gain reputation points** for quality submissions.
- **Staking mechanism** prevents spam and ensures high-quality participation.

### 🛠️ Confidence Filtering & Weighted Voting
- Reputation-based **weighted voting system**.
- Eliminates users who blindly click to earn rewards.
- Uses **confidence filtering** to remove low-effort submissions.

## Tech Stack

### Frontend
- **Next.js + TypeScript** (Performance & Scalability)
- **Tailwind CSS** (Modern UI Styling)
- **Recoil** (State Management)
- **Solana Wallet Adapter** (Wallet Connection & Authentication)

### Backend
- **Node.js & Express.js** (API Development)
- **Prisma + PostgreSQL** (Database Management)
- **Anchor Framework** (Solana Smart Contracts)
- **NaCl Signature Verification** (Wallet Authentication Security)

## Getting Started

### Prerequisites
- **Node.js** (v16+ recommended)
- **Yarn** or **npm**
- **Solana Wallet** (e.g., Phantom Wallet)
- **PostgreSQL Database**

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/web3-task-platform.git
   cd web3-task-platform
   ```
2. Install dependencies:
   ```sh
   yarn install
   ```
3. Set up environment variables:
   ```sh
   cp .env.example .env
   ```
   - Configure the `.env` file with database credentials and Solana RPC details.
4. Run the backend:
   ```sh
   yarn dev:server
   ```
5. Run the frontend:
   ```sh
   yarn dev:client
   ```

### Smart Contract Deployment
1. Install **Anchor**:
   ```sh
   cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked --force
   ```
2. Build and deploy contracts:
   ```sh
   anchor build
   anchor deploy
   ```

## Contributing
We welcome contributions! Feel free to open issues and pull requests.

## License
This project is licensed under the **MIT License**.

## Contact
For any inquiries, reach out to **ahmxd989@gmail.com** or create a GitHub issue.


