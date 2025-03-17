This Web3-based platform enables users to post tasks and complete tasks in exchange for blockchain-based payments. The primary use case focuses on YouTube thumbnail selection tasks, where users upload multiple variants of a thumbnail, and workers vote on the best-performing option to optimize Click-Through Rates (CTR).

The platform is completely decentralized and uses Solana blockchain for payments and authentication. Users sign in via their wallets, eliminating the need for Web2-based authentication.

Key Features
🔗 Wallet-Based Authentication
Users connect their Solana wallet to sign in.
No traditional email/password login—Web3-only authentication.
Secure authentication using signMessage().

📝 Task Creation & Bidding

Users post tasks, specifying a reward in SOL.
Task includes multiple thumbnail options.
Workers select the best thumbnail based on their judgment.

💰 Decentralized Payments

Payments are locked in a smart contract when the task is created.
Workers receive payments once they submit their selections.
No middleman, instant transactions.

⭐ Reputation & Staking System

Workers gain reputation points for quality submissions.
Staking mechanism prevents spam and ensures high-quality participation.

🛠️ Confidence Filtering & Weighted Voting

Reputation-based weighted voting system.
Eliminates users who blindly click to earn rewards.
Uses confidence filtering to remove low-effort submissions.

Tech Stack:

Frontend-
Next.js + TypeScript (Performance & Scalability)
Tailwind CSS (Modern UI Styling)
Recoil (State Management)
Solana Wallet Adapter (Wallet Connection & Authentication)

Backend-

Node.js & Express.js (API Development)
Prisma + PostgreSQL (Database Management)
Anchor Framework (Solana Smart Contracts)
NaCl Signature Verification (Wallet Authentication Security)
