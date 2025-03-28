import React, { useState } from 'react';
import { CheckIcon } from 'lucide-react';

interface ConfirmButtonProps {
    isAvailable: boolean;
    onClose: () => void | Promise<void>;
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({ isAvailable, onClose }) => {
    const [buttonState, setButtonState] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleClick = async () => {
        if (!isAvailable) return;

        // Set to loading state
        setButtonState('loading');

        try {
            // Perform the close operation
            
            // Extended loading time (2.5 seconds)
            await new Promise(resolve => setTimeout(resolve, 2500));
            await new Promise(resolve => setTimeout(resolve, 2500));
            
            // Show success state 
            setButtonState('success');
            await onClose();

            // Wait for success animation

            // Reset to idle state
            setButtonState('idle');
        } catch (error) {
            // Reset to idle if there's an error
            setButtonState('idle');
            console.error(error);
        }
    };
    const renderButtonContent = () => {
        switch (buttonState) {
            case 'loading':
                return (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-solid"></div>
                    </div>
                );
            case 'success':
                return (
                    <div className="animate-ping">
                        <CheckIcon className="text-white" size={24} />
                    </div>
                );
            default:
                return 'Confirm';
        }
    };

    return (
        <button
            type="submit"
            onClick={handleClick}
            className={`
        px-4 py-2 rounded-lg transition flex items-center justify-center 
        min-w-[100px] min-h-[40px]
        ${buttonState === 'success' ? 'bg-green-600' :
                    (isAvailable ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600/50 cursor-not-allowed')
                }
      `}
            disabled={!isAvailable || buttonState !== 'idle'}
        >
            {renderButtonContent()}
        </button>
    );
};

export default ConfirmButton;