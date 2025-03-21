import { X } from "lucide-react";
import { Card, CardTitle } from "./ui/card";
import { StepTwoProps } from "./MultiStepForm";
import { IconArrowLeft } from "@tabler/icons-react";

export const StepTwo = ({ imageURL, nextStep, prevStep, handleImageUpload, removeImage }: StepTwoProps) => {
    return (
        <div className="h-full flex flex-col max-h-[calc(100vh-12rem)] ">
            <h1 className="text-2xl font-bold text-white mb-6">Upload Thumbnail Options</h1>

            <Card className="flex-1 bg-[#222222] border border-gray-800 shadow-md rounded-xl px-8 pt-8 pb-4 flex flex-col gap-6 ">
                <div className="flex flex-col gap-4 ">
                    <CardTitle className="text-lg font-semibold text-gray-200">Upload 2-5 Thumbnails For Testing:</CardTitle>

                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-red-400 transition-all">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            id="image-upload"
                            onChange={handleImageUpload}
                        />
                        <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-300">Click to upload thumbnails</span>
                            <span className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB each</span>
                        </label>
                    </div>

                    {imageURL.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-300 mb-2">Selected Thumbnails ({imageURL.length})</p>
                            <div className="max-h-64 overflow-y-auto pr-1 custom-scrollbar ">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {imageURL.map((img, index) => (
                                        <div key={index} className="relative group">
                                            <div className="aspect-square bg-[#151515] rounded-lg overflow-hidden">
                                                <img
                                                    src={img.image_url}
                                                    alt={`Thumbnail preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button
                                                className="absolute top-1 right-1 bg-black/80 p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeImage(index)}
                                            >
                                                <X size={14} className="text-red-500" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
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
