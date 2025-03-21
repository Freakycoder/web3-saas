import { Card, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Form } from "./MultiStepForm";


export const StepOne = ({ formData, setFormData, nextStep }: Form) => {
    return (
        <div className="h-full flex flex-col ">
            <h1 className="text-2xl font-bold text-white mb-6">Enter Thumbnail Details</h1>

            <Card className="flex-1 bg-[#222222] border border-gray-800 shadow-md rounded-xl px-8 pt-8 pb-4 flex flex-col gap-6 ">
                <div className="flex flex-col gap-2">
                    <CardTitle className="text-lg font-semibold text-gray-200">Enter Video Title</CardTitle>
                    <Input
                        placeholder="e.g. 'How I Gained 100K Subscribers in 30 Days'"
                        className="border border-gray-700 bg-[#181818] text-white p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <CardTitle className="text-lg font-semibold text-gray-200">Enter Video Description</CardTitle>
                    <textarea
                        placeholder="Describe your video content and target audience..."
                        className="border border-gray-700 bg-[#181818] text-white p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all h-32 resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>
                <div className="flex justify-end mt-auto">
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

