import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Scale, Wallet, Youtube } from 'lucide-react'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useWallet } from '@solana/wallet-adapter-react'
import { UserModal } from './UserModal'
import { motion } from "motion/react"


const user = { name: "Alex Johnson", email: "alex@example.com", username: "alexcreator" }

export const Navbar = () => {
    const router = useRouter();
    const [userData, setUserData] = useState(user);
    const [isclient, setIsClient] = useState(false);
    const { connected, signMessage, publicKey } = useWallet();
    const [isHoveredHome, setIsHoveredHome] = useState(false);
    const [isHoveredMarketplace, setIsHoveredMarketplace] = useState(false);
    const [isHoveredProfile, setIsHoveredProfile] = useState(false);
    const [isOpen, setisOpen] = useState(false);

    const [token, setToken] = useState<string>('');


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

                setToken(response.data.token);

                console.log(token);
                localStorage.setItem('token', token);
                console.log("token recieved");
            }
            catch (e) {
                console.error("Wallet authentication failed:", e);
            }
        }
        setisOpen(true);
        authenticateUser();
        setIsClient(true);
    }, [connected])


    return <>
        <nav className="w-full bg-[#0f0f0f] border-b border-gray-800 py-4 px-8 flex justify-between items-center relative z-10">
            <button className="flex items-center gap-2"
                onClick={() => router.push('/')}>
                <Youtube className="text-red-600" size={24} />
                <span className="text-xl font-bold">EyeBalls</span>
            </button>

            <div className="flex items-center gap-4">
                <div className="relative inline-block">

                    <button
                        className="px-4 py-2 font-medium text-base focus:outline-none"
                        onMouseEnter={() => setIsHoveredHome(true)}
                        onMouseLeave={() => setIsHoveredHome(false)}
                        onClick={() => router.push('/home')}
                    >
                        Home
                    </button>

                    {/* Animated underline container */}
                    <div className="absolute bottom-0 left-0 w-full h-0.5 overflow-hidden">
                        {/* Animated underline that grows from center */}
                        <div
                            className={`
            h-full bg-red-500 
            transform origin-center 
            transition-all duration-300 ease-out
            ${isHoveredHome ? 'scale-x-100' : 'scale-x-0'}
          `}
                        />
                    </div>
                </div>

                <div className="relative inline-block">

                    <button
                        className="px-4 py-2 font-medium text-base focus:outline-none"
                        onMouseEnter={() => setIsHoveredMarketplace(true)}
                        onMouseLeave={() => setIsHoveredMarketplace(false)}
                        onClick={() => router.push('/marketplace')}
                    >
                        Marketplace
                    </button>

                    {/* Animated underline container */}
                    <div className="absolute bottom-0 left-0 w-full h-0.5 overflow-hidden">
                        {/* Animated underline that grows from center */}
                        <div
                            className={`
            h-full bg-red-500 
            transform origin-center 
            transition-all duration-300 ease-out
            ${isHoveredMarketplace ? 'scale-x-100' : 'scale-x-0'}
          `}
                        />
                    </div>
                </div>


                <Sheet>
                    <SheetTrigger asChild>
                        <div className="relative inline-block">
                            <button
                                className="px-4 py-2 font-medium text-base focus:outline-none"
                                onMouseEnter={() => setIsHoveredProfile(true)}
                                onMouseLeave={() => setIsHoveredProfile(false)}
                            >
                                Profile
                            </button>

                            {/* Animated underline container */}
                            <div className="absolute bottom-0 left-0 w-full h-0.5 overflow-hidden">
                                {/* Animated underline that grows from center */}
                                <div
                                    className={`
            h-full bg-red-500 
            transform origin-center 
            transition-all duration-300 ease-out
            ${isHoveredProfile ? 'scale-x-100' : 'scale-x-0'}
          `}
                                />
                            </div>
                        </div>
                    </SheetTrigger>

                    <SheetContent className="bg-[#222222] border-l border-gray-800 text-white w-full max-w-md sm:max-w-md">
                        <SheetHeader className="mb-6">
                            <SheetTitle className="text-2xl font-bold text-white">Your Profile</SheetTitle>
                            <SheetDescription className="text-gray-400">
                                Manage your account details and creator settings
                            </SheetDescription>
                        </SheetHeader>

                        <div className="space-y-6">
                            {/* Profile Header with Avatar */}
                            <div className="flex items-center gap-4 py-4 border-b border-gray-800">

                                <div>
                                    <h3 className="text-xl font-semibold">{userData.name}</h3>
                                    <p className="text-gray-400">@{userData.username}</p>
                                </div>
                            </div>

                            {/* Account Information Form */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-semibold text-gray-200">Account Information</h4>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Display Name</label>
                                    <Input
                                        value={userData.name}
                                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                        className="border border-gray-700 bg-[#181818] text-white p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Username</label>
                                    <Input
                                        value={userData.username}
                                        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                                        className="border border-gray-700 bg-[#181818] text-white p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Email Address</label>
                                    <Input
                                        value={userData.email}
                                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                        className="border border-gray-700 bg-[#181818] text-white p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Subscription Details */}
                            <div className="p-4 bg-[#181818] border border-gray-700 rounded-lg">
                                <h4 className="text-lg font-semibold text-gray-200 mb-3">Subscription</h4>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-white font-medium">Creator Pro</p>
                                        <p className="text-gray-400 text-sm">Unlimited thumbnail tests</p>
                                    </div>
                                    <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full">Active</span>
                                </div>
                                <Button className="w-full mt-4 bg-[#333333] hover:bg-[#444444] text-white border border-gray-700">
                                    Manage Subscription
                                </Button>
                            </div>
                        </div>

                        <SheetFooter className="flex justify-between mt-6 pt-4 border-t border-gray-800">
                            <Button className="bg-transparent hover:bg-[#333333] text-gray-400 border border-gray-700">
                                Sign Out
                            </Button>

                            <SheetClose asChild>
                                <Button className="bg-red-600 hover:bg-red-700 text-white">
                                    Save Changes
                                </Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>

                {isclient && (
                    <WalletMultiButton className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition">
                        <motion.div
                            className='flex gap-2 items-center'
                            whileTap={{ scale: 0.8 }}>
                            <Wallet size={18} />
                            <span>Connect</span>
                        </motion.div>
                    </WalletMultiButton>
                )}
            </div>
        </nav>
        {token && <UserModal isOpen={isOpen} onClose={() => { setisOpen(false) }} onSubmit={() => { }} />}
    </>
}


