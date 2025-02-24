"use client";
import { useEffect, useState } from "react";
import { IconWallet, IconSquareRoundedPlus } from "@tabler/icons-react"
import Link from "next/link";
import { MultiStepForm } from './MultiStepForm'
import { Modal } from './Modal'
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";


export const Navbar = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { connected, signMessage, publicKey } = useWallet();
    const [isClient, setIsClient] = useState(false);

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
            <h1 className="text-2xl font-bold text-gray-800"><Link href={'turborepo/apps/frontend/public/logo.png'} /></h1>
            <div className="flex items-center gap-4">

                <div>
                    <button
                        className="bg-orange-500 hover:bg-orange-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <IconSquareRoundedPlus size={22} /> Create
                    </button>
                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <MultiStepForm />
                    </Modal>
                </div>
                {/* apply the logic mentioned by GPT to make the connect button UX better */}
                {isClient && <WalletMultiButton className="bg-purple-500 hover:bg-purple-700 text-white text-md px-6 py-6 rounded-lg transition-all"><IconWallet size={22} /> Connect</WalletMultiButton>}
            </div>
        </nav>
    );
}