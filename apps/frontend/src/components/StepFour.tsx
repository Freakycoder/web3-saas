import { ArrowLeft } from "lucide-react";
import { Card, CardTitle } from "./ui/card";
import { Form } from "./MultiStepForm";
import { IconArrowLeft } from "@tabler/icons-react";

// Extending the Form interface to include image data 
interface StepFourProps extends Form {
  // Adding imageURL to access the uploaded images   
  imageURL?: { image_url: string }[];
}

export const StepFour = ({ formData, prevStep, nextStep, imageURL = [] }: StepFourProps) => {
  // Calculate visible and hidden images
  const visibleImages = imageURL.slice(0, 3);
  const hiddenImagesCount = imageURL.length - 3;
  const solanaLogo = "https://assets.coingecko.com/coins/images/4128/large/solana.png";

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-2xl font-bold text-white mb-6">Preview Your Task</h1>

      <Card className="flex-1 bg-[#222222] border border-gray-800 shadow-md rounded-xl px-8 pt-8 pb-4 flex flex-col">
        <CardTitle className="text-lg font-semibold text-gray-200 mb-6">Test Summary</CardTitle>

        {/* Scrollable content area with mandatory scrollbar */}
        <div className="flex-1 ">
          {/* Main content area with vertical split */}
          <div className="flex flex-col md:flex-row gap-6 min-h-min pb-2">
            {/* Left column: Title, Description and Images */}
            <div className="md:w-2/3">
              {/* Title and Description section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">{formData.title || "Untitled Test"}</h3>
                <p className="text-gray-300 mt-2">{formData.description || "No description provided."}</p>
              </div>

              {/* Images gallery */}
              {imageURL && imageURL.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-200 mb-2">Images ({imageURL.length})</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {visibleImages.map((img, index) => (
                      <div key={index} className="rounded-lg overflow-hidden h-24 bg-[#181818] border border-gray-700">
                        <img src={img.image_url} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {hiddenImagesCount > 0 && (
                      <div className="flex items-center justify-center bg-[#181818] border border-gray-700 rounded-lg h-24 text-gray-300">
                        <span>+{hiddenImagesCount} more</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right column: Audience and Cost */}
            <div className="md:w-1/3">
              <div className="bg-[#181818] border border-gray-700 rounded-lg p-6">
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-400">Audience Size</h4>
                  <p className="text-white font-semibold text-lg mt-1">{formData.audienceSize || 0} users</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400">Payment Amount</h4>
                  <div className="flex items-center gap-1 justify-start">
                  <img src={solanaLogo} alt="Solana Logo" width="30" height="30" />
                  <p className="text-white font-semibold text-lg mt-1">{formData.amount?.toFixed(3) || "0.000"}</p>
                  </div>
                </div>
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