import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import { StepThreeA, StepThreeB } from "./StepThree";
import { StepFour } from "./StepFour";

interface FormData {
    title: string;
    description: string;
    amount: number;
    // add completionTime field also, just need the days in number.
    transactionSignature: string;
    audienceSize: number;
}

export interface Form {
    formData: FormData;
    setFormData: (formData: FormData) => void;
    nextStep?: () => void;
    prevStep?: () => void;
    verifyTransaction?: () => void;
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

// Enhanced Step indicator component
const StepIndicator = ({ currentStep }: { currentStep: number }) => {
    const steps = [
        { number: 1, title: "Details" },
        { number: 2, title: "Upload" },
        { number: 3, title: "Audience" },
        { number: 4, title: "Preview" },
        { number: 5, title: "Payment" }
    ];

    return (
        <div className="w-full mb-2">
            <div className="flex items-center justify-between mx-auto max-w-3xl px-28">
                {steps.map((step, index) => (
                    <div key={step.number} className="flex flex-col items-center relative">
                        {/* Connecting line - improved positioning */}
                        {index < steps.length - 1 && (
                            <div className="absolute top-4 left-1/2 h-1 bg-gray-700 w-16" style={{ transform: 'translateX(50%)' }}>
                                <motion.div 
                                    className="h-full bg-red-600"
                                    initial={{ width: currentStep > step.number ? "100%" : "0%" }}
                                    animate={{ width: currentStep > step.number ? "100%" : "0%" }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                ></motion.div>
                            </div>
                        )}
                        
                        {/* Step circle with smooth animation */}
                        <motion.div 
                            className={`z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                                currentStep >= step.number 
                                    ? 'bg-red-600 border-red-400' 
                                    : 'bg-gray-700 border-gray-600'
                            }`}
                            initial={false}
                            animate={{ 
                                scale: currentStep === step.number ? 1.1 : 1,
                                borderColor: currentStep >= step.number ? '#f87171' : '#4b5563'
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            {currentStep > step.number ? (
                                <motion.svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-4 w-4 text-white" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                    initial={{ opacity: 0, pathLength: 0 }}
                                    animate={{ opacity: 1, pathLength: 1 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <motion.path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M5 13l4 4L19 7"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                    />
                                </motion.svg>
                            ) : (
                                <span className="text-xs text-white font-bold">{step.number}</span>
                            )}
                        </motion.div>
                        
                        {/* Step title with animation */}
                        <motion.span 
                            className="mt-2 text-xs"
                            animate={{ 
                                color: currentStep === step.number ? '#ef4444' : '#9ca3af',
                                fontWeight: currentStep === step.number ? 'bold' : 'normal'
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            {step.title}
                        </motion.span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const MultiStepForm = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        amount: 0,
        transactionSignature: "",
        audienceSize: 0
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

    // Enhanced step transition animations
    const stepVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            x: 20,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="w-full flex flex-col">
            <div className="w-full sticky top-0 z-10 p-8  bg-[#181818]/80 border border-gray-700/50 shadow-2xl">
                <StepIndicator currentStep={step} />
            </div>
            
            <div className="w-full flex flex-row">
                {/* Main content area */}
                <div className="w-full p-8">
                    {/* This is the primary container that holds the steps with a fixed height */}
                    <div className="h-[500px] relative">
                        {/* This is the scrollable container where the step components are rendered */}
                        <div className="absolute inset-0 ">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    variants={stepVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
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
                                    {step === 3 && <StepThreeA formData={formData} setFormData={setFormData} prevStep={prevStep} nextStep={nextStep} />}
                                    {step === 4 && <StepFour formData={formData} setFormData={setFormData} prevStep={prevStep} nextStep={nextStep} imageURL={imageURL} />}
                                    {step === 5 && <StepThreeB formData={formData} setFormData={setFormData} prevStep={prevStep} nextStep={nextStep} />}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Scrollbar styling - simplified and made more prominent */}
            <style jsx global>{`
                /* Base scrollbar styling */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 12px; /* Increased width for better visibility */
                    display: block;
                }
                
                /* Track styling */
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #2a2a2a;
                    border-radius: 6px;
                    margin: 4px;
                }
                
                /* Thumb styling */
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #ef4444;
                    border-radius: 6px;
                    border: 2px solid #2a2a2a;
                }
                
                /* Hover state */
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #f87171;
                }
                
                /* Firefox compatibility */
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #ef4444 #2a2a2a;
                }
                
                /* Ensure the scrollbar is always visible */
                .custom-scrollbar {
                    overflow-y: scroll !important;
                }
            `}</style>
        </div>
    );
};

export default MultiStepForm;