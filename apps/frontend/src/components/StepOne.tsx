import { Card, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Form } from "./MultiStepForm";

export const StepOne = ({ formData, setFormData, nextStep }: Form) => {
    return (
        <div className="h-full flex flex-col">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Task</h1>

            <Card className="flex-1 bg-white shadow-md rounded-xl p-8 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <CardTitle className="text-lg font-semibold text-gray-700">Enter the Title</CardTitle>
                    <Input
                        placeholder="Enter the title"
                        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <CardTitle className="text-lg font-semibold text-gray-700">Enter the Description</CardTitle>
                    <textarea
                        placeholder="Enter the description"
                        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all h-32 resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>
                <div className="mt-auto">
                    <button
                        onClick={nextStep}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium text-lg transition-all duration-200"
                    >
                        Next
                    </button>
                </div>
            </Card>
        </div>
    );
};