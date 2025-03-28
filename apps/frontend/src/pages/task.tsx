import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  ArrowLeft, 
  Clock, 
  DollarSign, 
  ThumbsUp, 
  ThumbsDown, 
  Share, 
  User, 
  MessageSquare,
  Award,
  AlertCircle,
  Loader,
  Star
} from 'lucide-react';

// Types
interface ThumbnailOption {
  id: number;
  image: string;
  title: string;
  votes: number;
}

interface TaskData {
  id: string;
  title: string;
  description: string;
  creator: string;
  creatorAvatar: string;
  category: string;
  reward: number;
  votes: number;
  timeRemaining: string;
  thumbnailOptions: ThumbnailOption[];
  totalVoters: number;
  creatorStats: {
    subscribers: string;
    videosPosted: number;
    avgCTR: string;
  }
}

const TaskDetailPage = (taskId: string) => {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0 });
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [task, setTask] = useState<TaskData | null>(null);
  const [scrollY, setScrollY] = useState(0);
  
  // Fetch task data
  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Example API call - replace with your actual API endpoint
        const response = await axios.get(`http://localhost:3000/v1/user/getTask`, {
          params: {
            taskId: taskId
          }
        });
        setTask(response.data);
        
        // Set initial timer from API data
        if (response.data.timeRemaining) {
          const [hours, minutes, seconds] = response.data.timeRemaining.split(':').map(Number);
          setTimeLeft({ minutes: hours * 60 + minutes, seconds });
        }
      } catch (err) {
        console.error('Failed to fetch task:', err);
        setError('Failed to load task data. Please try again later.');
        
        // Fallback to sample data for demo purposes
        setTask({
          id: taskId as string || '12345',
          title: 'Which thumbnail will get more clicks for my new guitar tutorial?',
          description: 'I created several thumbnail options for my new "Advanced Jazz Guitar Techniques" video. Looking for feedback on which one will drive the most engagement from viewers who are intermediate guitar players.',
          creator: 'GuitarMaster Pro',
          creatorAvatar: 'https://images.pexels.com/photos/2007647/pexels-photo-2007647.jpeg?auto=compress&cs=tinysrgb&w=600',
          category: 'Music',
          reward: 250,
          votes: 342,
          timeRemaining: '23:45:30',
          thumbnailOptions: [
            {
              id: 1,
              image: 'https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg?auto=compress&cs=tinysrgb&w=600',
              title: 'Option A: Close-up of guitar technique',
              votes: 156
            },
            {
              id: 2,
              image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=600',
              title: 'Option B: Guitar with text overlay',
              votes: 186
            },
            {
              id: 3,
              image: 'https://images.pexels.com/photos/682933/pexels-photo-682933.jpeg?auto=compress&cs=tinysrgb&w=600',
              title: 'Option C: Side-by-side comparison',
              votes: 0
            }
          ],
          totalVoters: 342,
          creatorStats: {
            subscribers: '125K',
            videosPosted: 87,
            avgCTR: '8.2%'
          }
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTask();
  }, [taskId]);
  
  // Track mouse movement for background effect
  useEffect(() => {
    const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Timer countdown effect
  useEffect(() => {
    if (!task) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else {
          clearInterval(timer);
          return { minutes: 0, seconds: 0 };
        }
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [task]);
  
  // Handle voting
  const handleVote = (optionId: number) => {
    setSelectedOption(optionId);
  };
  
  const submitVote = async () => {
    if (!selectedOption || !taskId) return;
    
    try {
      // Optimistic UI update
      setHasVoted(true);
      
      // API call to submit vote
      await axios.post(`/api/tasks/${taskId}/vote`, {
        optionId: selectedOption
      });
      
      // Success toast or notification could be added here
    } catch (err) {
      console.error('Failed to submit vote:', err);
      setHasVoted(false); // Revert optimistic update
      // Error toast or notification could be added here
    }
  };
  
  // Format timer display
  const formatTime = (time: { minutes: number, seconds: number }) => {
    return `${Math.floor(time.minutes / 60).toString().padStart(2, '0')}:${(time.minutes % 60).toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`;
  };

  // Enhanced animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };
  
  const slideUp = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };
  
  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  
  const pulseAnimation = {
    initial: { scale: 1 },
    pulse: { 
      scale: [1, 1.05, 1],
      transition: { 
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-[#0f0f0f] min-h-screen text-white flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-4 inline-block"
          >
            <Loader size={40} className="text-blue-500" />
          </motion.div>
          <h2 className="text-xl font-medium mb-2">Loading Task</h2>
          <p className="text-gray-400">Fetching the latest data...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error && !task) {
    return (
      <div className="bg-[#0f0f0f] min-h-screen text-white flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-medium mb-2">Error Loading Task</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => router.push('/marketplace')}
            className="px-4 py-2 bg-[#222] hover:bg-[#333] rounded-lg transition"
          >
            Return to Marketplace
          </button>
        </motion.div>
      </div>
    );
  }

  if (!task) return null;

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white">
      {/* Main Content */}
      <div className="px-4 sm:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <button
              className="flex items-center gap-2 text-gray-400 hover:text-white transition"
              onClick={() => router.push('/marketplace')}
            >
              <ArrowLeft size={16} /> Back to Marketplace
            </button>
          </div>

          {/* Two Column Layout */}
          <div className="flex flex-col lg:flex-row">
            {/* Left Column - 60% */}
            <div className="w-full lg:w-[60%] pr-0 lg:pr-8">
              {/* Title and Basic Info */}
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-[#222] text-green-400 px-3 py-1 rounded-full text-xs">
                    {task.category}
                  </span>
                  <span className="bg-[#222] text-yellow-400 px-3 py-1 rounded-full text-xs flex items-center">
                    <DollarSign size={12} className="mr-1" /> {task.reward} tokens
                  </span>
                  <span className="bg-[#222] text-red-400 px-3 py-1 rounded-full text-xs flex items-center">
                    <Clock size={12} className="mr-1" /> {formatTime(timeLeft)}
                  </span>
                </div>
                <h1 className="text-3xl font-bold">{task.title}</h1>
              </div>

              {/* Task Description */}
              <div className="mb-8">
                <div className="flex flex-col gap-2 mb-4">
                <h2 className="text-xl font-semibold">Task Description</h2>
                <span className="w-52 flex-grow h-px bg-gradient-to-r from-red-900/50 via-red-600/30 to-transparent"></span>
                </div>
                <p className="text-gray-300 mb-6">
                  {task.description}
                </p>
                
                <div className="flex items-center p-3 rounded-lg bg-[#111]/50">
                  <img 
                    src={task.creatorAvatar} 
                    alt={task.creator} 
                    className="w-10 h-10 rounded-full mr-3" 
                  />
                  <div>
                    <div className="font-medium">{task.creator}</div>
                    <div className="text-sm text-gray-400 flex flex-wrap items-center gap-3">
                      <span className="flex items-center">
                        <Star size={12} className="mr-1 text-yellow-500" /> {task.creatorStats.subscribers}
                      </span>
                      <span className="flex items-center">
                        <ThumbsUp size={12} className="mr-1 text-blue-400" /> {task.creatorStats.avgCTR} CTR
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stylish Divider */}
              <div className="flex items-center my-10">
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
                <div className="mx-4 w-8 h-8 rounded-full flex items-center justify-center bg-[#222]">
                  <ThumbsUp size={14} className="text-blue-400" />
                </div>
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
              </div>

              {/* Thumbnail Options */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Thumbnail Options</h2>
                  <div className="text-sm bg-[#222] px-3 py-1 rounded-full text-gray-300">
                    <ThumbsUp size={14} className="inline mr-1 text-blue-400" /> {task.totalVoters} votes
                  </div>
                </div>
                
                {hasVoted ? (
                  <div className="bg-[#222]/50 border-l-2 border-green-500 pl-4 py-3 mb-6">
                    <div className="font-medium text-green-400 mb-2 flex items-center">
                      <ThumbsUp size={16} className="mr-2" /> Thank you for your vote!
                    </div>
                    <p className="text-gray-300 text-sm">
                      You've earned 5 tokens for participating. Vote on more thumbnails to earn additional rewards.
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#222]/50 border-l-2 border-blue-500 pl-4 py-3 mb-6">
                    <div className="font-medium text-blue-400 mb-2 flex items-center">
                      <AlertCircle size={16} className="mr-2" /> Instructions
                    </div>
                    <p className="text-gray-300 text-sm">
                      Select the thumbnail you believe will perform best based on click-through rate potential. Select an option below and click "Submit Vote" to earn 5 tokens.
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {task.thumbnailOptions.map((option) => (
                    <div 
                      key={option.id}
                      className={`border rounded-lg p-3 cursor-pointer transition ${
                        selectedOption === option.id 
                          ? 'border-blue-500 bg-blue-500/10' 
                          : 'border-gray-800 hover:border-gray-700 hover:bg-[#1a1a1a]/50'
                      }`}
                      onClick={() => !hasVoted && handleVote(option.id)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-sm">{option.title}</h3>
                        {hasVoted && (
                          <div className="bg-[#222] px-2 py-0.5 rounded-full text-xs">
                            {option.votes} votes
                          </div>
                        )}
                      </div>
                      <div className="relative overflow-hidden rounded-lg h-28 sm:h-32">
                        <img 
                          src={option.image} 
                          alt={option.title} 
                          className="w-full h-full rounded-lg object-cover"
                        />
                        {selectedOption === option.id && !hasVoted && (
                          <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20 backdrop-blur-sm">
                            <div className="bg-blue-500 text-white rounded-full p-1.5">
                              <ThumbsUp size={18} />
                            </div>
                          </div>
                        )}
                        {hasVoted && selectedOption === option.id && (
                          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                            Your Choice
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {!hasVoted && (
                  <div className="flex justify-center">
                    <button
                      onClick={submitVote}
                      disabled={!selectedOption}
                      className={`px-6 py-3 rounded-lg font-medium transition ${
                        selectedOption
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Submit Vote
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Vertical Divider between columns */}
            <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-gray-700 to-transparent mx-4"></div>
            
            {/* Right Column - 40% */}
            <div className="w-full lg:w-[40%] mt-10 lg:mt-0 pl-0 lg:pl-4">
              {/* Reward Information */}
              <div className="mb-10">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <DollarSign size={18} className="mr-2 text-green-500" />
                  Reward Information
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                    <span className="text-gray-400">Participation reward</span>
                    <span className="font-medium text-green-500 flex items-center">
                      <DollarSign size={14} className="mr-1" /> 5 tokens
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                    <span className="text-gray-400">If your pick wins</span>
                    <span className="font-medium text-green-500 flex items-center">
                      <DollarSign size={14} className="mr-1" /> +15 tokens
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Results announced</span>
                    <span className="text-gray-300">When timer ends</span>
                  </div>
                </div>
              </div>
              
              {/* Stylish Divider with Red Accent */}
              <div className="flex items-center my-10">
                <div className="flex-grow h-px bg-gradient-to-r from-red-900/50 via-red-600/30 to-transparent"></div>
                <div className="mx-4 px-3 py-1 rounded-full border border-red-600/30 text-xs text-red-400">
                  Stats
                </div>
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-red-600/30 to-red-900/50"></div>
              </div>
              
              {/* Task Statistics */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Award size={18} className="mr-2 text-purple-500" />
                  Task Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                    <span className="text-gray-400">Total voters</span>
                    <span className="bg-[#222] px-3 py-1 rounded-full text-sm">
                      {task.totalVoters}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                    <span className="text-gray-400">Reward pool</span>
                    <span className="font-medium text-green-500 flex items-center">
                      <DollarSign size={14} className="mr-1" /> {task.reward} tokens
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Category</span>
                    <span className="bg-[#222] text-xs px-3 py-1 rounded-full">
                      {task.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0f0f0f] text-white py-8 px-8 border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <MessageSquare className="text-red-600" size={20} />
            <span className="text-lg font-bold">ThumbBoost</span>
          </div>

          <div className="flex gap-8">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition">Help Center</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition">Contact</a>
          </div>

          <div className="text-gray-500 text-xs mt-4 md:mt-0">
            © 2025 ThumbBoost. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TaskDetailPage;