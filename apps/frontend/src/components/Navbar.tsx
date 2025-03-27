import React, { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Camera, CheckCircle, CircleDollarSign, Scale, Star, User, Wallet, XCircle, Youtube, Lock } from 'lucide-react'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useWallet } from '@solana/wallet-adapter-react'
import { UserModal } from './UserModal'
import { UnifiedWalletButton } from '@jup-ag/wallet-adapter'
import { motion } from 'framer-motion'
import { env } from 'process'
import { toast } from 'sonner'


interface UserData {
    id: string;
    username: string;
    name: string; // This maps to display_name in your DB
    reputation: number;
    task_completed: number;
    task_failed: number;
    pending_amount: number;
    locked_amount: number;
    avatarUrl?: string;
    avatarFile?: File;
}

export const Navbar = () => {
    const router = useRouter();
    // const [userData, setUserData] = useState(user);
    const [isclient, setIsClient] = useState(false);
    const { connected, signMessage, publicKey } = useWallet();
    const [isHoveredHome, setIsHoveredHome] = useState(false);
    const [isHoveredMarketplace, setIsHoveredMarketplace] = useState(false);
    const [isHoveredProfile, setIsHoveredProfile] = useState(false);
    const [isOpen, setisOpen] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const solanaLogo = "https://assets.coingecko.com/coins/images/4128/large/solana.png";

    const [userData, setUserData] = useState<UserData>();
    const [token, setToken] = useState<string>('');

    if(!userData) return

    const totalTasks = userData.task_completed + userData.task_failed;
    const completionRate = totalTasks > 0
        ? Math.round((userData.task_completed / totalTasks) * 100)
        : 0;

   
    const saveChanges = async () => {
        try {
            const response = await axios.put('http://localhost:3001/v1/user/updateUserDetails', {
                avatar : userData.avatarFile,
                username : userData.username
            })
            toast(response.data)
        } catch (error) {
            console.error("Error saving user data:", error);
            toast("Error Saving User Data")
        }
    };


    const getUserData = async() => {
        const response  = await axios.get('http://localhsot:3001/v1/user/getUserData', {
            headers : {
                Authorization : `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
            }
        });

        const userResponse : UserData = response.data;
        const userData = {...userResponse , avatarUrl : userResponse.avatarFile ? URL.createObjectURL(userResponse.avatarFile) : undefined}
        setUserData(userData)
    }


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
                    signature: Buffer.from(signature).toString('base64'),
                    publicKey: publicKey
                })

                setToken(response.data.token);
                process.env.NEXT_PUBLIC_TOKEN = token;

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
                                onClick={getUserData}
                            >
                                Profile
                            </button>

                            {/* Animated underline */}
                            <div className="absolute bottom-0 left-0 w-full h-0.5 overflow-hidden">
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

                    <SheetContent
                        className="
            bg-gradient-to-b 
            from-black/90 
            to-black/95
            backdrop-blur-xl 
            border-l 
            border-red-500/30 
            text-white 
            w-full 
            max-w-md 
            sm:max-w-md 
            custom-scrollbar
            overflow-hidden
            shadow-[0_0_15px_rgba(239,68,68,0.15)]
        "
                    >
                        <div className="relative h-full flex flex-col">
                            {/* Animated Gradient Accent Layer */}
                            <div
                                className="
                    absolute 
                    top-0 
                    left-0 
                    right-0 
                    h-32 
                    bg-gradient-to-r 
                    from-red-500/20 
                    via-purple-500/20 
                    to-red-500/20 
                    blur-3xl 
                    opacity-60 
                    -z-10
                    animate-gradient-x
                "
                            />

                            <SheetHeader className="relative z-10 p-6">
                                <SheetTitle className="text-2xl font-bold text-white">Your Profile</SheetTitle>
                                <SheetDescription className="text-gray-300">
                                    Manage your account details and stats
                                </SheetDescription>
                            </SheetHeader>

                            <div className="flex-grow overflow-y-auto px-6 space-y-8">
                                {/* Profile Header - Keeping the same as requested */}
                                <div className="flex items-center space-x-6 bg-white/5 p-4 rounded-xl border border-white/10">
                                    {/* Avatar */}
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-red-500/30">
                                        {userData.avatarUrl ? (
                                            <img
                                                src={userData.avatarUrl}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                                <User size={64} className="text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* User Details */}
                                    <div>
                                        <h3 className="text-xl font-semibold">{userData.name}</h3>
                                        <p className="text-gray-400 text-md mb-2">@{userData.username}</p>

                                        {/* Reputation */}
                                        <div className="flex items-center bg-white/10 px-3 py-1 rounded-full hover:scale-105 transition-all duration-300">
                                            <Star size={16} className="text-yellow-500 mr-1.5" />
                                            <span className="font-medium text-yellow-100">
                                                {userData.reputation} reputation
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Wallet Section - Redesigned */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-medium text-red-400 uppercase tracking-wider flex items-center">
                                        <Wallet size={16} className="mr-2" />
                                        Wallet Overview
                                    </h4>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-3 items-center justify-center bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-4 border border-white/10 hover:border-yellow-500/30 transition-all duration-300 shadow-sm">
                                            <span className="text-xs text-gray-400 uppercase tracking-wider">
                                                Pending Amount
                                            </span>
                                            <div className="flex items-center gap-2 justify-center text-lg font-semibold text-white">
                                                <img src={solanaLogo} alt="Solana Logo" width="24" height="24" />
                                                {userData.pending_amount}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3 items-center justify-center bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-4 border border-white/10 hover:border-blue-500/30 transition-all duration-300 shadow-sm">
                                                <span className="text-xs text-gray-400 uppercase tracking-wider">
                                                    Locked Amount
                                                </span>
                                            <div className="flex items-center gap-2 justify-center text-lg font-semibold text-white">
                                                <img src={solanaLogo} alt="Solana Logo" width="24" height="24" />
                                                {userData.locked_amount}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

                                {/* Profile Management Section - Redesigned */}
                                <div className="space-y-6">
                                    <h4 className="text-sm font-medium text-red-400 uppercase tracking-wider flex items-center">
                                        <User size={16} className="mr-2" />
                                        Profile Management
                                    </h4>

                                    {/* Profile Picture */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <h5 className="text-sm text-white font-medium">Profile Picture</h5>
                                                <p className="text-xs text-gray-400">Update your profile avatar</p>
                                            </div>

                                            <div className="flex items-center space-x-4">
                                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-md">
                                                    {userData.avatarUrl ? (
                                                        <img
                                                            src={userData.avatarUrl}
                                                            alt="Profile"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                                            <User size={32} className="text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <input
                                                    type="file"
                                                    id="avatar-upload"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            const file = e.target.files[0];
                                                            const imageUrl = URL.createObjectURL(file);
                                                            setUserData({ ...userData, avatarUrl: imageUrl, avatarFile: file });
                                                        }
                                                    }}
                                                    ref={avatarInputRef}
                                                />
                                                <Button
                                                    onClick={() => avatarInputRef.current?.click()}
                                                    className="
                                                        bg-gradient-to-r
                                                        from-red-500/20
                                                        to-red-500/30
                                                        hover:from-red-500/30
                                                        hover:to-red-500/40
                                                        border
                                                        border-red-500/30
                                                        text-white
                                                        shadow-sm
                                                    "
                                                    size="sm"
                                                >
                                                    <Camera size={14} />
                                                    Change
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Thin Divider */}
                                    <div className="h-px bg-white/10" />

                                    {/* Display Name */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <h5 className="text-sm text-white font-medium">Display Name</h5>
                                                <p className="text-xs text-gray-400">How you'll appear to others</p>
                                            </div>
                                            <Input
                                                value={userData.name}
                                                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                                className="
                                                    w-60
                                                    bg-white/5
                                                    border
                                                    border-white/20
                                                    text-white
                                                    focus:border-red-500/50
                                                    focus:ring-2
                                                    focus:ring-red-500/20
                                                    shadow-sm
                                                "
                                                placeholder="Your display name"
                                            />
                                        </div>
                                    </div>

                                    {/* Thin Divider */}
                                    <div className="h-px bg-white/10" />

                                    {/* Username */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <h5 className="text-sm text-white font-medium">Username</h5>
                                                <p className="text-xs text-gray-400">Unique identifier for your account</p>
                                            </div>
                                            <div className="w-60">
                                                <Input
                                                    value={userData.username}
                                                    className="
                                                        bg-white/5
                                                        border
                                                        border-white/20
                                                        text-white
                                                        opacity-70
                                                        shadow-sm
                                                    "
                                                    disabled
                                                />
                                                <p className="text-xs text-gray-500 mt-1 text-right italic">Cannot be changed</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

                                {/* Performance Stats Section - Added */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-medium text-red-400 uppercase tracking-wider flex items-center">
                                        <CheckCircle size={16} className="mr-2" />
                                        Performance Stats
                                    </h4>

                                    <div className="flex space-x-4">
                                        <div className="flex bg-gradient-to-br from-green-500/10 to-green-500/20 rounded-xl px-4 py-2 border border-green-500/20">
                                            <div className="flex items-center gap-2">
                                                <div className="text-xs text-gray-400">Completed</div>
                                                <div className="text-green-400">{userData.task_completed}</div>
                                            </div>
                                        </div>
                                        <div className="flex bg-gradient-to-br from-red-500/10 to-red-500/20 rounded-xl px-4 py-2 border border-red-500/20">
                                            <div className="flex items-center gap-2">
                                                <div className="text-xs text-gray-400">Failed</div>
                                                <div className="text-red-400">{userData.task_failed}</div>
                                            </div>
                                        </div>
                                        <div className="flex bg-gradient-to-br from-blue-500/10 to-blue-500/20 rounded-xl px-4 py-2 border border-blue-500/20">
                                            <div className="flex items-center gap-2">
                                                <div className="text-xs text-gray-400">Rate</div>
                                                <div className="text-blue-400">{completionRate}%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <SheetFooter className="pt-4 px-6 mt-2 border-t border-white/10 bg-black/40 backdrop-blur-lg">
                                <div className="flex justify-between w-full">
                                    <SheetClose asChild>
                                        <Button
                                            variant="ghost"
                                            className="
                                                text-white 
                                                bg-white/5
                                                hover:bg-white/10 
                                                border 
                                                border-white/10
                                                shadow-sm
                                            "
                                        >
                                            <XCircle size={16} className="opacity-70" />
                                            Cancel
                                        </Button>
                                    </SheetClose>
                                    <Button
                                        className="
                                            bg-gradient-to-r
                                            from-red-500/20
                                            to-red-500/30
                                            hover:from-red-500/30
                                            hover:to-red-500/40
                                            border 
                                            border-red-500/30 
                                            text-white 
                                            shadow-sm
                                        "
                                        onClick={saveChanges}
                                    >
                                        <CheckCircle size={16} className="opacity-70" />
                                        Save Changes
                                    </Button>
                                </div>
                            </SheetFooter>
                        </div>
                    </SheetContent>
                </Sheet>

                {isclient && (
                    <motion.div
                        // Wrapper for overall button animation
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 10
                        }}
                        whileHover={{
                            scale: 1.05,
                            transition: { duration: 0.2 }
                        }}
                        whileTap={{
                            scale: 0.95,
                            transition: { duration: 0.1 }
                        }}
                        className="rounded-lg"
                    >
                        <UnifiedWalletButton
                            overrideContent={
                                <div className="flex items-center gap-2">
                                    <Wallet size={18} />
                                    <span>Connect</span>
                                </div>
                            }
                            buttonClassName={`relative overflow-hidden backdrop-blur-md bg-red-500/20 !important border border-red-500/30 !importanttext-white px-6 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-red-500/30 hover:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/50`}

                        />
                    </motion.div>
                )}
            </div>
        </nav>
        {token && <UserModal isOpen={isOpen} onClose={() => { setisOpen(false) }} onSubmit={() => { }} />}
    </>
}


