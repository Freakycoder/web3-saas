import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  AlertCircle
} from 'lucide-react';

const TaskDetailPage = () => {
  // State for mouse position (for background animation)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // State for the timer
  const [timeLeft, setTimeLeft] = useState({ minutes: 2, seconds: 30 });
  
  // State for voting
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  
  // Sample task data
  const task = {
    id: '12345',
    title: 'Which thumbnail will get more clicks for my new guitar tutorial?',
    description: 'I created several thumbnail options for my new "Advanced Jazz Guitar Techniques" video. Looking for feedback on which one will drive the most engagement from viewers who are intermediate guitar players.',
    creator: 'GuitarMaster Pro',
    creatorAvatar: '/api/placeholder/64/64',
    category: 'Music',
    reward: 250,
    votes: 342,
    timeRemaining: '23:45:30',
    thumbnailOptions: [
      {
        id: 1,
        image: '/api/placeholder/640/360',
        title: 'Option A: Close-up of guitar technique',
        votes: 156
      },
      {
        id: 2,
        image: '/api/placeholder/640/360',
        title: 'Option B: Guitar with text overlay',
        votes: 186
      },
      {
        id: 3,
        image: '/api/placeholder/640/360',
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
  };
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };
  
  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };
  
  // For staggered children animations
  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // Track mouse movement for background effect
  useEffect(() => {
    const handleMouseMove = (e :any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else {
          clearInterval(timer);
          return { hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Handle voting
  const handleVote = (optionId :any) => {
    setSelectedOption(optionId);
  };
  
  const submitVote = () => {
    if (selectedOption) {
      setHasVoted(true);
      // Here you would typically send the vote to your backend
    }
  };
  
  // Format timer display
  const formatTime = (time :any) => {
    return `${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white">
      {/* Interactive Background Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 w-64 h-64 rounded-full bg-red-500 opacity-10 blur-3xl"
          animate={{
            x: mousePosition.x * 0.05,
            y: mousePosition.y * 0.05,
          }}
          transition={{ type: "spring", damping: 20 }}
        />
        <motion.div
          className="absolute right-0 bottom-0 w-96 h-96 rounded-full bg-blue-500 opacity-10 blur-3xl"
          animate={{
            x: -mousePosition.x * 0.03,
            y: -mousePosition.y * 0.03,
          }}
          transition={{ type: "spring", damping: 20 }}
        />
        <motion.div
          className="absolute left-1/4 top-1/3 w-72 h-72 rounded-full bg-purple-500 opacity-10 blur-3xl"
          animate={{
            x: mousePosition.x * 0.02,
            y: -mousePosition.y * 0.02,
          }}
          transition={{ type: "spring", damping: 30 }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative px-8 py-12"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <motion.div variants={slideUp} className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <button
                className="flex items-center gap-2 text-gray-400 hover:text-white transition"
              >
                <ArrowLeft size={16} /> Back to Marketplace
              </button>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#222222] text-green-500 px-3 py-1 rounded-full text-xs">
                    {task.category}
                  </span>
                  <span className="bg-[#222222] text-yellow-500 px-3 py-1 rounded-full text-xs flex items-center">
                    <DollarSign size={12} className="mr-1" /> {task.reward} tokens
                  </span>
                </div>
                <h1 className="text-3xl font-bold mt-2 mb-2">{task.title}</h1>
              </div>
              
              <div className="flex items-center bg-[#181818] p-3 rounded-lg border border-gray-800">
                <div className="flex items-center mr-4">
                  <Clock size={18} className="text-red-400 mr-2" />
                  <div>
                    <div className="text-xl font-mono font-bold">{formatTime(timeLeft)}</div>
                    <div className="text-xs text-gray-400">Remaining Time</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main content area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column: Task details */}
            <motion.div variants={slideUp} className="lg:col-span-2">
              <div className="bg-[#181818] rounded-lg border border-gray-800 p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Task Description</h2>
                <p className="text-gray-300 mb-6">
                  {task.description}
                </p>
                
                <div className="flex items-center mb-4">
                  <img src={task.creatorAvatar} alt={task.creator} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <div className="font-medium">{task.creator}</div>
                    <div className="text-sm text-gray-400 flex items-center">
                      <span className="flex items-center mr-3">
                        <User size={12} className="mr-1" /> {task.creatorStats.subscribers}
                      </span>
                      <span className="flex items-center mr-3">
                        <ThumbsUp size={12} className="mr-1" /> {task.creatorStats.avgCTR} CTR
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thumbnail options */}
              <motion.div 
                variants={slideUp} 
                className="bg-[#181818] rounded-lg border border-gray-800 p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Thumbnail Options</h2>
                  <div className="text-sm text-gray-400">
                    <ThumbsUp size={14} className="inline mr-1" /> {task.totalVoters} votes total
                  </div>
                </div>
                
                {hasVoted ? (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6 text-center">
                    <div className="font-medium text-green-400 mb-2">Thank you for your vote!</div>
                    <p className="text-gray-300 text-sm">
                      You've earned 5 tokens for participating. Vote on more thumbnails to earn additional rewards.
                    </p>
                  </div>
                ) : (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                    <div className="font-medium text-blue-400 mb-2 flex items-center">
                      <AlertCircle size={16} className="mr-2" /> Instructions
                    </div>
                    <p className="text-gray-300 text-sm">
                      Select the thumbnail you believe will perform best based on click-through rate potential. Select an option below and click "Submit Vote" to earn 5 tokens.
                    </p>
                  </div>
                )}
                
                <div className="space-y-6">
                  {task.thumbnailOptions.map((option) => (
                    <div 
                      key={option.id}
                      className={`border ${selectedOption === option.id ? 'border-blue-500' : 'border-gray-800'} rounded-lg p-4 cursor-pointer transition hover:border-gray-700`}
                      onClick={() => !hasVoted && handleVote(option.id)}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">{option.title}</h3>
                        {hasVoted && (
                          <div className="bg-[#222222] px-3 py-1 rounded-full text-xs">
                            {option.votes} votes
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <img 
                          src={option.image} 
                          alt={option.title} 
                          className="w-full rounded-lg aspect-video object-cover"
                        />
                        {selectedOption === option.id && !hasVoted && (
                          <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20 rounded-lg">
                            <div className="bg-blue-500 text-white rounded-full p-2">
                              <ThumbsUp size={24} />
                            </div>
                          </div>
                        )}
                        {hasVoted && selectedOption === option.id && (
                          <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs">
                            Your Choice
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {!hasVoted && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={submitVote}
                      disabled={!selectedOption}
                      className={`px-6 py-3 rounded-lg font-medium transition ${
                        selectedOption
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Submit Vote
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
            
            {/* Right column: Stats and additional info */}
            <motion.div variants={slideUp} className="space-y-6">
              {/* Timer card for mobile view (hidden on large screens) */}
              <div className="lg:hidden bg-[#181818] rounded-lg border border-gray-800 p-4">
                <div className="flex items-center">
                  <Clock size={20} className="text-red-400 mr-3" />
                  <div>
                    <div className="text-2xl font-mono font-bold">{formatTime(timeLeft)}</div>
                    <div className="text-xs text-gray-400">Remaining Time</div>
                  </div>
                </div>
              </div>
              
              {/* Reward info */}
              <div className="bg-[#181818] rounded-lg border border-gray-800 p-4">
                <h3 className="text-lg font-medium mb-4">Reward Information</h3>
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
              
              {/* Stats card */}
              <div className="bg-[#181818] rounded-lg border border-gray-800 p-4">
                <h3 className="text-lg font-medium mb-4">Task Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                    <span className="text-gray-400">Total voters</span>
                    <span>{task.totalVoters}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                    <span className="text-gray-400">Reward pool</span>
                    <span className="font-medium text-green-500 flex items-center">
                      <DollarSign size={14} className="mr-1" /> {task.reward} tokens
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Category</span>
                    <span className="bg-[#222222] text-xs px-2 py-1 rounded-full">
                      {task.category}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="bg-[#181818] rounded-lg border border-gray-800 p-4">
                <h3 className="text-lg font-medium mb-4">Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-[#222222] hover:bg-[#2a2a2a] text-white py-2 px-4 rounded-lg transition flex items-center justify-center">
                    <Share size={16} className="mr-2" /> Share Task
                  </button>
                  <button className="w-full bg-[#222222] hover:bg-[#2a2a2a] text-white py-2 px-4 rounded-lg transition flex items-center justify-center">
                    <MessageSquare size={16} className="mr-2" /> Leave Feedback
                  </button>
                  <button className="w-full bg-[#222222] hover:bg-[#2a2a2a] text-white py-2 px-4 rounded-lg transition flex items-center justify-center">
                    <Award size={16} className="mr-2" /> View Creator Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-[#0f0f0f] text-white py-8 px-8 border-t border-gray-800 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
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