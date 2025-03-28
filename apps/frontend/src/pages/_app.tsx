import "@/styles/globals.css";
import type { AppProps } from "next/app";
import '@solana/wallet-adapter-react-ui/styles.css'; // Required for UI components
import { UnifiedWalletProvider } from '@jup-ag/wallet-adapter';
import { Toaster } from "@/components/Toaster";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
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
      
      {/* The Toaster component is now outside of the UnifiedWalletProvider 
          to ensure it's accessible globally and not affected by wallet context */}
      <Toaster duration={3000} />
    </>
  );
}
