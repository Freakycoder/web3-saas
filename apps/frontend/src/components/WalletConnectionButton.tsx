import { WalletError } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function WalletConnectionButton() {
    const { publicKey, isConnecting, connectionError, HandleConnect } = useWalletConnection();

    const truncateAddress = (address: string) => {
        if (!address) return;
        return `${address.slice(0, 4)}...${address.slice(-4)}`
    }
    useEffect(() => {
        if (connectionError) {
            toast.error(connectionError);
        }
    }, [connectionError]);

    return (
        <div className="relative">
            <WalletMultiButton
                disabled={isConnecting}
                onClick={HandleConnect}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
            >
                <motion.div
                    className='flex gap-2 items-center'
                    whileTap={{ scale: 0.8 }}
                >
                    <Wallet size={18} />
                    <span>
                        {publicKey
                            ? truncateAddress(publicKey.toBase58())
                            : (isConnecting ? 'Connecting...' : 'Connect')
                        }
                    </span>
                </motion.div>
            </WalletMultiButton>

            {publicKey && (
                <WalletDisconnectButton
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
                >
                    Disconnect
                </WalletDisconnectButton>
            )}
            
        </div>
    );
}

const useWalletConnection = () => {
    const { publicKey, connect, disconnect, wallet, select } = useWallet() // connect is a function u call when u wanna manually access wallet connection (open the wallet modal).
    const [connectionError, setConnectionError] = useState<string | null>(); // used for displaying error messages to the user
    const [isConnecting, setIsConnecting] = useState<boolean>(); // to know the state of wallet connection process, if true = user connecting wallet / false = user disconnecting the wallet

    useEffect(() => {
        setConnectionError(null); // initially clear out the error state variable
    }, [publicKey]) // runs only when a user grants persmission to view their address.

    const HandleConnect = async () => {
        try {
            setIsConnecting(true);
            setConnectionError(null);
            if(!wallet){
                select(null);
                return
            }
            await connect();
        }
        catch (error: any) {
            if (error instanceof WalletError) {

                if (error.name === "WalletConnectionError") {
                    setConnectionError('Failed to connect wallet, Please try again');
                }
                else if (error.name === 'WalletSignMessageError') {
                    setConnectionError('Signature request was cancelled');
                }
                else if (error.name == "WalletWindowClosedError") {
                    setConnectionError('Wallet window closed, please try connecting again.')
                }
                else {
                    setConnectionError('An unexpected error occurred');
                }
                await disconnect(); // manually disconnect the moment any error occurs while connecting the wallet
            } else {
                setConnectionError('An unknown error occurred'); // Generic error fallback
            }
        }
        finally {
            setIsConnecting(false);
        }
    }
    return {
        publicKey,
        connectionError,
        isConnecting,
        HandleConnect
    }
}