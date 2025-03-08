"use client";
import { useEffect, useState } from "react";
import { IconWallet, IconSquareRoundedPlus, IconShoppingBag, IconClipboardList, IconChevronDown } from "@tabler/icons-react"
import Link from "next/link";
import { MultiStepForm } from './MultiStepForm'
import { Modal } from './Modal'
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { useRouter } from "next/router";


export const Navbar = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { connected, signMessage, publicKey } = useWallet();
    const [isTaskDropdownOpen, setIsTaskDropdownOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter()
    const userData = {
        name: "John Doe",
        avatar: "/turborepo/apps/frontend/public/profile-placeholder.png"
      };
      const handleGetStarted = () => {
        router.push('/home');
      };

    useEffect(() => {
        const authenticateUser = async () => {

            try {
                if (!connected || !publicKey || !signMessage) return

                const message = new TextEncoder().encode("Sign into mechanical turks");

                const signature = await signMessage(message).catch((error: any) => {
                    if (error.code === 4001 || error.message.includes("User rejected the request")) {
                        console.log("User rejected the wallet signature request. No action needed.");
                        return null; // Stop execution
                    }
                    throw error;
                });

                if (!signature) return

                const response = await axios.post('http://localhost:3001/v1/user/connected', {
                    signature: signature,
                    publicKey: publicKey
                })

                console.log(response.data.token);
                localStorage.setItem('token', response.data.token);
                console.log("token recieved");
            }
            catch (e) {
                console.error("Wallet authentication failed:", e);
            }
        }
        authenticateUser();
        setIsClient(true);
    }, [connected])

    return (
        <nav className="w-full bg-[#FDF8F4] shadow-md py-4 px-8 flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-gray-800">
            <Link href="/">
              <img src="/turborepo/apps/frontend/public/logo.png" alt="Logo" className="h-10" />
            </Link>
          </h1>
          
          {/* Right-side buttons */}
          <div className="flex items-center gap-4">
            {/* Get Started Button */}
            <button
              className="bg-orange-500 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition"
              onClick={handleGetStarted}
            >
              Get Started
            </button>
            
            {/* Wallet Connect Button */}
            {isClient && (
              <WalletMultiButton className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition">
                <IconWallet size={18} />
                <span>Connect</span>
              </WalletMultiButton>
            )}
          </div>
        </nav>
      );
}