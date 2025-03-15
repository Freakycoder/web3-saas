import React from 'react';
import { Card, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/router';

interface taskProps {
    taskId: string
}

export const TaskInstructionsContent = ({ taskId }: taskProps) => {
    const router = useRouter();
    const solanaLogo = "https://assets.coingecko.com/coins/images/4128/large/solana.png";
    // Default task details if none are provided
    const defaultTask = {
        instructions: "Follow the instructions carefully to complete this task.",
        penalties: [
            "Leaving the task incomplete will result in loss of staked amount",
            "Completing the task too quickly may be flagged as spam and result in penalties",
            "Multiple violations may result in account restrictions"
        ],
        stakeAmount: "0.05",
        timeEstimate: "30 - 60 seconds",
        rewards: "Return of stake + 0.02 ETH bonus"
    };

    return (
        <div className="w-full flex flex-col">
            <Card className="flex-1 bg-[#222222]/80 border border-gray-800 shadow-md rounded-xl p-8 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col max-w-36">
                        <CardTitle className="text-lg font-semibold text-gray-200 mb-1">
                            Task Instructions
                        </CardTitle>
                        <hr className="border-b-2 border-red-500" />
                    </div>
                    <p className="text-gray-300">
                        {defaultTask.instructions}
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <CardTitle className="text-lg font-semibold text-gray-200">Penalties</CardTitle>
                    <div className="flex flex-col gap-2">
                        {defaultTask.penalties.map((penalty, index) => (
                            <div key={index} className="flex items-start">
                                <span className="text-red-500 mr-2 text-lg">•</span>
                                <p className="text-gray-300">{penalty}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <CardTitle className="text-lg font-semibold text-gray-200">Staking Information</CardTitle>
                    <div className="bg-[#181818] border border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-700">
                            <span className="text-gray-400">Amount to Stake:</span>
                            <div className='flex justify-center items-center gap-2'>
                                <span className=" text-gray-500">
                                    <img src={solanaLogo} alt="Solana Logo" width="30" height="30" />
                                </span>
                                <span className="font-bold text-white">{defaultTask.stakeAmount}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-700">
                            <span className="text-gray-400">Estimated time:</span>
                            <span className=" text-white">{defaultTask.timeEstimate}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-400">Successful completion:</span>
                            <span className="font-medium text-green-500">{defaultTask.rewards}</span>
                        </div>
                    </div>
                </div>
                <div className=" flex justify-end">

                    <button
                        onClick={() => router.push(`/task/${taskId}`)}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Confirm & Stake
                    </button>
                </div>
            </Card>
        </div>
    );
};

