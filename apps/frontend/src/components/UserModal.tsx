import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, AlertCircle, User, Camera } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Buffer } from 'buffer';

interface UsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileComplete: () => void;
}

interface UserData {
  name: string;
  username: string;
  avatar: File | null;
}

export const UserModal = ({
  isOpen,
  onClose,
  onProfileComplete
}: UsernameModalProps) => {
  const [userData, setUserData] = useState<UserData>({ username: '', name: "", avatar: null });
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [hasFocused, setHasFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [existingUsernames, setExistingUsernames] = useState<string[]>([]);

  // Username Availability Check
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

  // Fetch Existing Usernames
  useEffect(() => {
    const getUsernames = async () => {
      try {
        const response = await axios.get('http://localhost:3001/v1/user/getUsernames', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setExistingUsernames(response.data);
      } catch (error) {
        console.error("Error fetching usernames:", error);
      }
    };

    if (isOpen) {
      getUsernames();
    }
  }, [isOpen]);

  // Username Availability Check Trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      if (userData.username && hasFocused) {
        checkUsername(userData.username);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [userData.username, hasFocused]);

  // File to Buffer Conversion
  const fileToBuffer = async (file: File): Promise<Buffer> => {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
  };

  // Profile Setup Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAvailable) {
      toast.error("Please choose a valid username");
      return;
    }

    try {
      const avatarBuffer = userData.avatar ? await fileToBuffer(userData.avatar) : null;

      const response = await axios.post('http://localhost:3001/v1/user/userData', {
        name: userData.name,
        username: userData.username,
        avatar: avatarBuffer
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      toast.success("Profile updated successfully.");
      onProfileComplete();
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
    }
  };

  // Image Selection Handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUserData(prevData => ({ ...prevData, avatar: file }));
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Modal Background */}
          <motion.div
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none px-4">
            <motion.div
              className="w-full max-w-md bg-[#181818]/80 border border-gray-700/50 shadow-2xl rounded-lg overflow-hidden pointer-events-auto text-white backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <motion.button
                className="absolute right-4 top-4 p-2 text-gray-300 hover:text-white rounded-full hover:bg-white/10 transition z-10"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <X size={20} />
              </motion.button>

              <div className="p-6">
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
                        {userData.avatar ? (
                          <img
                            src={URL.createObjectURL(userData.avatar)}
                            className="w-full h-full object-cover"
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

                  {/* Display Name Input */}
                  <div className="mb-4">
                    <label htmlFor="display-name" className="block text-sm font-medium mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      id="display-name"
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={userData.name}
                      onChange={(e) => setUserData(prevData => ({ ...prevData, name: e.target.value }))}
                      placeholder="How others will see you"
                      minLength={2}
                      required
                    />
                  </div>

                  {/* Username Input */}
                  <div className="mb-6">
                    <label htmlFor="username" className="block text-sm font-medium mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="username"
                        className={`w-full bg-gray-800/50 border ${
                          isAvailable === true ? 'border-green-500' :
                          isAvailable === false ? 'border-red-500' : 'border-gray-600'
                        } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        value={userData.username}
                        onChange={(e) => setUserData(prevData => ({ ...prevData, username: e.target.value }))}
                        onFocus={() => setHasFocused(true)}
                        placeholder="Enter username (min 3 characters)"
                        minLength={3}
                        required
                      />

                      {/* Status Indicator */}
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {isChecking && (
                          <div className="h-5 w-5 border-t-2 border-blue-500 rounded-full animate-spin" />
                        )}
                        {!isChecking && isAvailable === true && (
                          <Check className="text-green-500" size={20} />
                        )}
                        {!isChecking && isAvailable === false && (
                          <AlertCircle className="text-red-500" size={20} />
                        )}
                      </div>
                    </div>

                    {/* Feedback Messages */}
                    <div className="mt-2 min-h-6 text-sm">
                      {!isChecking && isAvailable === false && (
                        <p className="text-red-400">This username is already taken</p>
                      )}
                      {!isChecking && isAvailable === true && (
                        <p className="text-green-400">Username is available!</p>
                      )}
                      {(userData.username.length > 0 && userData.username.length < 3) && (
                        <p className="text-yellow-400">Username must be at least 3 characters</p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
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
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      disabled={!isAvailable}
                    >
                      Save Profile
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};