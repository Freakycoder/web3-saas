import { IconArrowLeft } from "@tabler/icons-react";
import { Card, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Form } from "./MultiStepForm";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

export const StepThreeA = ({ formData, setFormData, prevStep, nextStep }: Form) => {
  // Audience size options with associated costs
  const audienceOptions = [
    { size: 100, label: "100 viewers", cost: 0.5, channelSize: "≤ 10K subscribers" },
    { size: 250, label: "250 viewers", cost: 1.25, channelSize: "10K-50K subscribers" },
    { size: 500, label: "500 viewers", cost: 2.5, channelSize: "50K-100K subscribers" },
    { size: 1000, label: "1000 viewers", cost: 5.0, channelSize: "100K+ subscribers" }
  ];
  const solanaLogo = "https://assets.coingecko.com/coins/images/4128/large/solana.png";

  // State for selected audience option
  const [selectedOption, setSelectedOption] = useState(audienceOptions[0]);

  // Calculate expected views based on audience size and average CTR
  const calculateEstimatedViews = () => {
    // Using an average CTR of 5.5%
    const averageCTR = 5.5;
    return Math.round(selectedOption.size * (averageCTR / 100));
  };

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-2xl font-bold text-white mb-6">Configure Your Test</h1>

      <Card className="flex-1 bg-[#222222] border border-gray-800 shadow-md rounded-xl px-8 pt-8 pb-4 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <CardTitle className="text-lg font-semibold text-gray-200">
            Select Your Audience Size
          </CardTitle>

          <p className="text-gray-400 mb-4">
            Choose the appropriate audience size based on your channel's subscriber count.
            Larger audience sizes provide more accurate test results but cost more.
          </p>

          {/* Audience size selection buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audienceOptions.map((option) => (
              <button
                key={option.size}
                onClick={() => setSelectedOption(option)}
                className={`p-4 rounded-lg border transition-all duration-200 flex flex-col items-start h-full
                    ${selectedOption.size === option.size
                    ? 'border-red-500 bg-[#2a1a1a] shadow-md shadow-red-900/20'
                    : 'border-gray-700 bg-[#1b1b1b] hover:bg-[#252525]'}`}
              >
                <div className="flex justify-between w-full items-center mb-2">
                  <span className="text-xl font-bold text-white">{option.label}</span>
                  {selectedOption.size === option.size && (
                    <div className="bg-red-500 rounded-full w-3 h-3"></div>
                  )}
                </div>

                <div className="text-gray-400 mb-2">
                  For channels with {option.channelSize}
                </div>

                <div className="flex items-center justify-center gap-2 mt-auto pt-2 border-t border-gray-700 w-full text-white ">
                <img src={solanaLogo} alt="Solana Logo" width="30" height="30" />
                  {option.cost.toFixed(2)} 
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Results preview card */}
        <div className="mt-6 p-6 bg-[#181818] rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Test Summary</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Target Audience:</span>
              <span className="text-white font-medium">{selectedOption.size} viewers</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Channel Size:</span>
              <span className="text-white font-medium">{selectedOption.channelSize}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Average CTR:</span>
              <span className="text-white font-medium">5.5%</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-700">
              <span className="text-gray-200">Estimated Views:</span>
              <span className="text-xl font-bold text-red-500">{calculateEstimatedViews()}</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-700">
              <span className="text-gray-200">Expected Cost:</span>
              <div className="flex gap-1 items-center">
              <img src={solanaLogo} alt="Solana Logo" width="30" height="30" />
              <span className=" font-bold text-white">{selectedOption.cost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between">
          <button
            onClick={prevStep}
            className="flex items-center gap-2 px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-[#1a1a1a] transition-colors"
          >
            <IconArrowLeft size={16} />
            <span>Back</span>
          </button>
          <button
            onClick={nextStep}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Next
          </button>
        </div>
      </Card>
    </div>
  );
};

export const StepThreeB = ({ formData, setFormData, prevStep, nextStep, verifyTransaction }: Form) => {
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
  }, []);

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-2xl font-bold text-white mb-6">Verify Transaction</h1>

      <Card className="flex-1 bg-[#222222] border border-gray-800 shadow-md rounded-xl px-8 pt-8 pb-4 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <CardTitle className="text-lg font-semibold text-gray-200">Enter Amount & Transaction Signature</CardTitle>

          <div className="flex items-center gap-2 mt-2 mb-1">
            <div className="relative flex-1">
              <Input
                type="float"
                min="0"
                step="0.01"
                placeholder="Enter SOL amount"
                className="border border-gray-700 bg-[#181818] text-white p-3 pl-14 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                value={formData.amount || ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    amount: parseInt(e.target.value)
                  });
                }}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <img src={solanaLogo} alt="Solana Logo" width="30" height="30" />
              </span>
            </div>
            <div className="flex-1 relative">
              <Input
                type="number"
                min="0"
                step="0.01"
                readOnly
                value={formData.amount * solPrice!}
                className="border border-gray-700 bg-[#181818] text-white p-3 pl-14 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <img src={usdtLogo} alt="Solana Logo" width="30" height="30" />
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-400">Please provide the transaction signature to verify and complete your task creation.</p>

          <div className="mt-2">
            <Input
              placeholder="Enter transaction signature"
              className="border border-gray-700 bg-[#181818] text-white p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-mono text-sm"
              value={formData.transactionSignature}
              onChange={(e) => setFormData({ ...formData, transactionSignature: e.target.value })}
            />
          </div>

          <div className="mt-4 p-4 bg-[#2a1a1a] rounded-lg border border-red-900">
            <h3 className="text-sm font-medium text-red-400">Important Notes</h3>
            <ul className="mt-2 text-s text-red-300 space-y-1 list-disc list-inside">
              <li>Ensure the transaction has been confirmed on the blockchain</li>
              <li>The signature must be associated with your wallet address</li>
              <li>This process may take a few moments to verify</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between">
          <button
            onClick={prevStep}
            className="flex items-center gap-2 px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-[#1a1a1a] transition-colors"
          >
            <IconArrowLeft size={16} />
            <span>Back</span>
          </button>
          <button
            onClick={nextStep}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Confirm & Stake
          </button>
        </div>
      </Card>
    </div>
  );
};