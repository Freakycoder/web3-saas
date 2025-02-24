import { IconArrowLeft } from "@tabler/icons-react";
import { Card, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Form } from "./MultiStepForm";
import { useEffect, useState } from "react";
import axios from "axios"
import {SiSolana , SiTether} from "react-icons/si"

export const StepThree = ({ formData, setFormData, prevStep, verifyTransaction }: Form) => {

    const [solPrice, setSolPrice] = useState<number>();

    const solanaLogo = "https://assets.coingecko.com/coins/images/4128/large/solana.png";
    const usdtLogo = "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png";


    useEffect(() => {
        const fetchSolPrice = async () => {
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
                setSolPrice(response.data.solana.usd);
            } catch (error) {
                console.error('Error fetching SOL price:', error);
            }
        };
    
        fetchSolPrice();
        const interval = setInterval(fetchSolPrice, 120000);
    
        return () => clearInterval(interval); // runs when the components unmounts or is no longer rendered
    }, []);
    

    return (
        <div className="h-full flex flex-col">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Verify Transaction</h1>

            <Card className="flex-1 bg-white shadow-md rounded-xl p-8 flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <CardTitle className="text-lg font-semibold text-gray-700">Enter Amount & Transaction Signature</CardTitle>


                    <div className="flex items-center gap-2 mt-2 mb-1">
                        <div className="relative flex-1">
                            <Input
                                type="float"
                                min="0"
                                step="0.01"
                                placeholder="Enter SOL amount"
                                className="border border-gray-300 p-3 pl-14 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                value={formData.amount || ""}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        amount: parseInt(e.target.value)
                                    });
                                }}
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"><img src={solanaLogo} alt="Solana Logo" width="30" height="30" /></span>
                        </div>
                        <div className="flex-1 relative">
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                readOnly
                                value={formData.amount * solPrice!}
                                className="border border-gray-300 p-3 pl-14 rounded-lg bg-gray-50 text-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"><img src={usdtLogo} alt="Solana Logo" width="30" height="30" /></span>
                        </div>
                    </div>

                    <p className="text-sm text-gray-600">Please provide the transaction signature to verify and complete your task creation.</p>

                    <div className="mt-2">
                        <Input
                            placeholder="Enter transaction signature"
                            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all font-mono text-sm"
                            value={formData.transactionSignature}
                            onChange={(e) => setFormData({ ...formData, transactionSignature: e.target.value })}
                        />
                    </div>

                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                        <h3 className="text-sm font-medium text-yellow-800">Important Notes</h3>
                        <ul className="mt-2 text-xs text-yellow-700 space-y-1 list-disc list-inside">
                            <li>Ensure the transaction has been confirmed on the blockchain</li>
                            <li>The signature must be associated with your wallet address</li>
                            <li>This process may take a few moments to verify</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-auto flex justify-between">
                    <button
                        onClick={prevStep}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <IconArrowLeft size={16} />
                        <span>Back</span>
                    </button>
                    <button
                        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                        onClick={verifyTransaction}
                    >
                        Verify Transaction
                    </button>
                </div>
            </Card>
        </div>
    );
};