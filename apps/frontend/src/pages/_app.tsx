import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
  WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css'; // Required for UI components

export default function App({ Component, pageProps }: AppProps) {
  const network = WalletAdapterNetwork.Devnet; // Change to 'mainnet-beta' for production
  const endpoint = clusterApiUrl(network);

  const wallets = [new UnsafeBurnerWalletAdapter()];
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>

          <Component {...pageProps} />

        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider >
  );
}