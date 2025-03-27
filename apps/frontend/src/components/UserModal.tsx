import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, AlertCircle, User, Camera } from "lucide-react";
import React, { useState, useEffect, ReactNode, useRef } from "react";

interface UsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (username: string) => void;
  existingUsernames?: string[]; // For demo purposes, we'll use a list of existing usernames
}

export const UserModal = ({
  isOpen,
  onClose,
  onSubmit,
  existingUsernames = ["john_doe", "jane_smith", "dev_user", "admin", "test_user"]
}: UsernameModalProps) => {
  // State for the username input
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState('')
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [hasFocused, setHasFocused] = useState(false);
  const [profileImage, setProfileImage] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        delay: 0.1,
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

  // Function to check if username is available
  const checkUsername = (value: string) => {
    if (!value || value.length < 3) {
      setIsAvailable(null);
      return;
    }

    setIsChecking(true);

    setTimeout(() => {
      const isTaken = existingUsernames.includes(value);
      setIsAvailable(!isTaken);
      setIsChecking(false);
    }, 500);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (username && hasFocused) {
        checkUsername(username);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [username, hasFocused]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAvailable && username) {
      onSubmit(username);
      onClose();
    }
  };
  const handleImageChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create a preview URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      
      const response = await axios.post('http://localhsot:3001/v1/user/updateUserData' {
        name : user
    })
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none px-4">
            <motion.div
              className="w-full max-w-md bg-[#181818]/80 border border-gray-700/50 shadow-2xl rounded-lg overflow-hidden pointer-events-auto text-white backdrop-blur-sm"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 to-black/30 pointer-events-none" />
              <motion.button
                className="absolute right-4 top-4 p-2 text-gray-300 hover:text-white rounded-full hover:bg-white/10 transition z-10"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <X size={20} />
              </motion.button>
              <AnimatePresence mode="wait">
                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="relative z-0 p-6"
                >
                  <h2 className="text-xl font-semibold mb-6">Set Up Your Profile</h2>

                  <form onSubmit={handleSubmit}>
                    {/* Profile Image Selection */}
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <input
                          type="file"
                          id="profile-image"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                          ref={fileInputRef}
                        />
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="w-24 h-24 rounded-full bg-gray-800/70 border-2 border-dashed border-gray-600 hover:border-blue-500 flex items-center justify-center cursor-pointer transition-all overflow-hidden group"
                        >
                          {profileImage ? (
                            <motion.img
                              src={profileImage}
                              className="w-full h-full object-cover"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              alt="Profile"
                            />
                          ) : (
                            <User size={36} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
                          )}
                        </div>
                        <motion.div
                          className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1.5 cursor-pointer hover:bg-blue-600 transition-colors border-2 border-gray-900"
                          whileHover={{ scale: 1.1 }}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Camera size={14} />
                        </motion.div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="display-name" className="block text-sm font-medium mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        id="display-name"
                        className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="How others will see you"
                        minLength={2}
                        required
                      />

                      <label htmlFor="username" className="block text-sm font-medium mt-4 mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="username"
                          className={`w-full bg-gray-800/50 border ${isAvailable === true ? 'border-green-500' :
                            isAvailable === false ? 'border-red-500' : 'border-gray-600'
                            } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          value={username}
                          onChange={handleUsernameChange}
                          onFocus={() => setHasFocused(true)}
                          placeholder="Enter username (min 3 characters)"
                          minLength={3}
                          required
                        />

                        {/* Status indicator */}
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {isChecking && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="h-5 w-5 border-t-2 border-blue-500 rounded-full animate-spin"
                            />
                          )}

                          {!isChecking && isAvailable === true && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <Check className="text-green-500" size={20} />
                            </motion.div>
                          )}

                          {!isChecking && isAvailable === false && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <AlertCircle className="text-red-500" size={20} />
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {/* Feedback message */}
                      <div className="mt-2 min-h-6 text-sm">
                        {!isChecking && isAvailable === false && (
                          <motion.p
                            className="text-red-400"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            This username is already taken
                          </motion.p>
                        )}

                        {!isChecking && isAvailable === true && (
                          <motion.p
                            className="text-green-400"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            Username is available!
                          </motion.p>
                        )}

                        {(username.length > 0 && username.length < 3) && (
                          <motion.p
                            className="text-yellow-400"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            Username must be at least 3 characters
                          </motion.p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className={`px-4 py-2 rounded-lg transition ${isAvailable ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600/50 cursor-not-allowed'
                          }`}
                        disabled={!isAvailable}
                      >
                        Confirm
                      </button>
                    </div>
                  </form>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

