import { X } from "lucide-react";
import { Card, CardTitle } from "./ui/card";
import { StepTwoProps } from "./MultiStepForm";
import { IconArrowLeft } from "@tabler/icons-react";

export const StepTwo = ({ imageURL, nextStep, prevStep, handleImageUpload, removeImage }: StepTwoProps) => {
    return (
        <div className="h-full flex flex-col">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload Images</h1>

            <Card className="flex-1 bg-white shadow-md rounded-xl p-8 flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <CardTitle className="text-lg font-semibold text-gray-700">Select One or More Images Below:</CardTitle>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-all">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            id="image-upload"
                            onChange={handleImageUpload}
                        />
                        <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-700">Click to upload images</span>
                            <span className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</span>
                        </label>
                    </div>

                    {imageURL.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Selected Images ({imageURL.length})</p>
                            <div className="max-h-32 overflow-y-auto pr-1">
                                <div className="grid grid-cols-4 gap-1">
                                    {imageURL.map((img, index) => (
                                        <div key={index} className="relative group">
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                                <img
                                                    src={img.image_url}
                                                    alt={`Selected preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button
                                                className="absolute top-0.5 right-0.5 bg-white/80 p-0.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeImage(index)}
                                            >
                                                <X size={10} className="text-red-500" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
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
                        onClick={nextStep}
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                    >
                        Next
                    </button>
                </div>
            </Card>
        </div>
    );
};