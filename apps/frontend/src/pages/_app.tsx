import "@/styles/globals.css";
import type { AppProps } from "next/app";
import '@solana/wallet-adapter-react-ui/styles.css'; // Required for UI components
import { UnifiedWalletProvider } from '@jup-ag/wallet-adapter';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UnifiedWalletProvider wallets={[]} config={{
      theme: "jupiter",
      autoConnect: false,
      env: "devnet", // Change to 'mainnet-beta' for production
      metadata: {
        name: "Eyeballs",
        description: "web3 powered platform",
        url: '',
        iconUrls: []
      }
    }}>
      <Component {...pageProps} />
    </UnifiedWalletProvider>
  );
}
