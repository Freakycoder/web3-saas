import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  // Animation variants for the modal container
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.3,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };
  
  // Animation variants for the content inside the modal
  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.1, // Slight delay to let the modal container animate first
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Enhanced backdrop overlay with increased blur for depth */}
          <motion.div
            className="fixed inset-0 h-2xl bg-black/75 backdrop-blur-md z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose} // Close modal when clicking outside
          />
          
          {/* Modal container with glass-like effect */}
          <div className="fixed inset-0 h-2xl flex items-center justify-center z-50 pointer-events-none px-4">
            <motion.div
              className="w-[1000px] max-h-[95vh] bg-[#181818]/80 border border-gray-700/50 shadow-2xl rounded-lg overflow-hidden pointer-events-auto text-white backdrop-blur-sm flex flex-col"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(8px)",
              }}
            >
              {/* Content background with subtle gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 to-black/30 pointer-events-none" />
              
              {/* Close button with enhanced visibility */}
              <motion.button
                className="absolute right-4 top-4 p-2 text-gray-300 hover:text-white rounded-full hover:bg-white/10 transition z-10"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <X size={20} />
              </motion.button>
              
              {/* Content wrapper with separate animation */}
              <AnimatePresence mode="wait">
                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full h-full mb-4 relative z-0 overflow-y-auto max-h-[calc(95vh-16px)] custom-scrollbar "
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;