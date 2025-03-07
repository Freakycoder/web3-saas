import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios'
import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import { StepThree } from "./StepThree";

interface FormData {
    title: string;
    description: string;
    amount: number; 
    // add completionTime field also, just need the days in number.
    transactionSignature: string;
}

export interface Form {
    formData: FormData;
    setFormData: (formData: FormData) => void;
    nextStep?: () => void;
    prevStep?: () => void;
    verifyTransaction?: () => void
}

interface ImageURL {
    image_url: string;
}

export interface Image {
    imageURL: ImageURL[];
    setImageURL: (imageURL: ImageURL[]) => void;
    nextStep?: () => void;
    prevStep?: () => void;
    handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface StepTwoProps extends Image {
    removeImage: (index: number) => void;
}

export const MultiStepForm = () => {

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        amount: 0,
        transactionSignature: ""
    });
    const [imageURL, setImageURL] = useState<ImageURL[]>([]);
    const [s3Images, setS3Images] = useState<File[]>([]);
    const [isConfirmed, setIsConfirmed] = useState<boolean>();
    const [s3FullURL, setS3FullURL] = useState<string[]>([]);
    const [taskID, setTaskID] = useState<string>('');

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newImages: ImageURL[] = [];
            const s3Images: File[] = [];
            const filesArray = Array.from(e.target.files);

            filesArray.forEach((file) => {
                s3Images.push(file)
            })

            setS3Images((prevFile) => [...prevFile, ...s3Images]);

            filesArray.forEach(file => {
                const imageUrl = URL.createObjectURL(file);
                newImages.push({ image_url: imageUrl });
            });

            setImageURL(prev => [...prev, ...newImages]);
        }
    };

    const removeImage = (indexToRemove: number) => {
        setImageURL(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const nextStep = () => {
        setStep((prev) => prev + 1);
    };

    const prevStep = () => {
        setStep((prev) => prev - 1);
    };

    const handleTask = async () => {
        const response: string = await axios.post('http://localhost:3000/v1/user/task', {
            title: formData.title,
            description: formData.description,
            amount: formData.amount,
            signature: formData.transactionSignature,
        }, {
            headers: {
                "authorization": "Bearer token"
            }
        })
        setTaskID(response)
    }

    // verified the function, move on to next.
    const verifyTransaction = async () => {
        const response: string = await axios.post('http://localhost:3000/v1/user/confirmation', {
            signature: formData.transactionSignature,
            amount: formData.amount
        }, {
            headers: {
                "authorization": "Bearer token"
            }
        })
        if (response === "amount recieved") {
            setIsConfirmed(true);
        }
        else {
            setIsConfirmed(false);
        }
    }

    const getPresignedURL = async () => {
        s3Images.map(async (file) => {
            const data = await axios.get('http://localhost:3000/v1/user/presignedURLS', {
                params: {
                    filename: file.name,
                    filetype: file.type,
                    taskID: taskID
                }
            })
            //@ts-ignore
            const presignedURL = data.url;
            const awsResponse: string = await axios.put(presignedURL, file);
            setS3FullURL((prevURL) => [...prevURL, awsResponse])
        })
        uploadURLs()
    }

    const uploadURLs = async () => {
        const response = await axios.post('http://localhost:3000/v1/user/images', {
            fulls3urls: s3FullURL
        }, {
            headers: {
                "authorization": "bearer token"
            }
        })
    }

    const stepVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            x: 20,
            transition: {
                duration: 0.2,
                ease: "easeIn"
            }
        }
    };

    // Animation variant for preview content
    const previewVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                delay: 0.1,
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="w-full flex flex-row">
            {/* Left: Multi-Step Form (2/3 width) */}
            <div className="w-2/3 p-8 border-r border-gray-200">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="h-full"
                    >
                        {step === 1 && <StepOne formData={formData} setFormData={setFormData} nextStep={nextStep} />}
                        {step === 2 && <StepTwo
                            imageURL={imageURL}
                            setImageURL={setImageURL}
                            nextStep={nextStep}
                            prevStep={prevStep}
                            handleImageUpload={handleImageUpload}
                            removeImage={removeImage}
                        />}
                        {step === 3 && <StepThree formData={formData} setFormData={setFormData} prevStep={prevStep} verifyTransaction={verifyTransaction} />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Right: Live Preview (1/3 width) */}
            <motion.div
                className="w-1/3 bg-gray-50 p-8 flex flex-col"
                variants={previewVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center">
                    <h2 className="text-xl font-semibold text-gray-800">{formData.title || "Task Title Preview"}</h2>
                    <p className="text-gray-600 mt-3 text-center">{formData.description || "Task description will appear here..."}</p>

                    {/* Image Preview with animation - Now displays multiple images in a grid */}
                    <AnimatePresence>
                        {imageURL.length > 0 ? (
                            <motion.div
                                key="preview-grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 w-full grid grid-cols-2 gap-2"
                            >
                                {imageURL.map((img, index) => (
                                    <motion.div
                                        key={`preview-${index}`}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="relative aspect-square"
                                    >
                                        <img
                                            src={img.image_url}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="no-image"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-4 w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500"
                            >
                                No images selected
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Step indicator */}
                <div className="mt-auto pt-4 flex justify-between items-center">
                    <div className="flex space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`h-2.5 w-2.5 rounded-full ${step >= i ? "bg-blue-500" : "bg-gray-300"
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-gray-500">Step {step} of 3</span>
                </div>
            </motion.div>
        </div>
    );
};

export default MultiStepForm;