import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Search, Filter, ArrowUpDown, Clock, DollarSign, Star, ThumbsUp, Eye, Users, Heart, ArrowLeft, TrendingUp, Award } from 'lucide-react';
import { useRouter } from 'next/router';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Navbar } from '@/components/Navbar';
import Modal from '@/components/Modal';
import {TaskInstructionsContent} from '@/components/TaskInstructions';

const MarketplacePage = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Filter and sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOption, setSortOption] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [isOpen, setisOpen] = useState(false);
  const [taskId , setTaskId] = useState<string>('');

  // Animation for background
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mock marketplace tasks data
  const [tasks, setTasks] = useState([
    {
      id: "1",
      title: "Gaming Channel Thumbnail Review",
      creator: "GamerPro",
      creatorAvatar: "/api/placeholder/32/32",
      votes: 124,
      reward: 25,
      timeLeft: "2 days",
      image: "https://i.ytimg.com/vi/Nii_fBGb0_c/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDU-hiECHiIdVG13fPWK_n01KLbSg",
      category: "Gaming",
      liked: false,
      totalOptions: 3,
      description: "Help me choose the best thumbnail for my upcoming Minecraft speedrun video. Looking for high CTR options."
    },
    {
      id: "2",
      title: "Tech Review Thumbnail Options",
      creator: "TechGenius",
      creatorAvatar: "/api/placeholder/32/32",
      votes: 87,
      reward: 30,
      timeLeft: "1 day",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgszHwLkaj9nla5y7yENJf1sPkyjw9B1fVVQ&s",
      category: "Technology",
      liked: true,
      totalOptions: 4,
      description: "I've created multiple options for my iPhone 17 review. Need your votes on which will get the most clicks."
    },
    {
      id: "3",
      title: "Food Blog Thumbnail Selection",
      creator: "CookingMaster",
      creatorAvatar: "/api/placeholder/32/32",
      votes: 156,
      reward: 20,
      timeLeft: "3 days",
      image: "/api/placeholder/400/225",
      category: "Food",
      liked: false,
      totalOptions: 2,
      description: "Which thumbnail will make viewers hungry? Choosing between two styles for my pasta recipe video."
    },
    {
      id: "4",
      title: "Travel Vlog Cover Image",
      creator: "Wanderlust",
      creatorAvatar: "/api/placeholder/32/32",
      votes: 92,
      reward: 15,
      timeLeft: "4 days",
      image: "/api/placeholder/400/225",
      category: "Travel",
      liked: false,
      totalOptions: 5,
      description: "Five thumbnail options for my Japan travel vlog. Looking for the one that best captures the essence of Tokyo."
    },
    {
      id: "5",
      title: "Fitness Channel New Series",
      creator: "FitnessPro",
      creatorAvatar: "/api/placeholder/32/32",
      votes: 78,
      reward: 35,
      timeLeft: "12 hours",
      image: "/api/placeholder/400/225",
      category: "Fitness",
      liked: false,
      totalOptions: 3,
      description: "Launching a new workout series. Need to select the thumbnail that will attract the right audience."
    },
    {
      id: "6",
      title: "Educational Content Thumbnail",
      creator: "BrainBoost",
      creatorAvatar: "/api/placeholder/32/32",
      votes: 110,
      reward: 28,
      timeLeft: "5 days",
      image: "/api/placeholder/400/225",
      category: "Education",
      liked: true,
      totalOptions: 2,
      description: "Help me choose between two approaches for my physics explainer video - text-heavy or visual-focused."
    },
    {
      id: "7",
      title: "Music Video Cover Selection",
      creator: "MelodyMaker",
      creatorAvatar: "/api/placeholder/32/32",
      votes: 203,
      reward: 40,
      timeLeft: "1 day",
      image: "/api/placeholder/400/225",
      category: "Music",
      liked: false,
      totalOptions: 4,
      description: "Four different aesthetic options for my new music video. Which one stands out the most?"
    },
    {
      id: '8',
      title: "Beauty Tutorial Thumbnail",
      creator: "GlamGuide",
      creatorAvatar: "/api/placeholder/32/32",
      votes: 167,
      reward: 22,
      timeLeft: "3 days",
      image: "/api/placeholder/400/225",
      category: "Beauty",
      liked: false,
      totalOptions: 3,
      description: "Three thumbnail options for my skincare routine video. Which one would you click on?"
    },
    {
      id: "9",
      title: "Comedy Sketch Thumbnail",
      creator: "LaughFactory",
      creatorAvatar: "/api/placeholder/32/32",
      votes: 145,
      reward: 18,
      timeLeft: "2 days",
      image: "/api/placeholder/400/225",
      category: "Comedy",
      liked: true,
      totalOptions: 2,
      description: "Need help selecting the funniest thumbnail that will make viewers want to click."
    }
  ]);

  // Categories
  const categories = [
    'All',
    'Gaming',
    'Technology',
    'Food',
    'Travel',
    'Fitness',
    'Education',
    'Music',
    'Beauty',
    'Comedy'
  ];

  // Sort options
  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'reward', label: 'Highest Reward' },
    { value: 'votes', label: 'Most Votes' },
    { value: 'timeLeft', label: 'Ending Soon' }
  ];

  // Toggle like
  const toggleLike = (taskId: any) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, liked: !task.liked } : task
    ));
  };

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    setIsClient(true);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);


  // Filter tasks based on search and category
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = activeCategory === 'All' || task.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return <>
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

      {/* Navigation */}
      <Navbar />

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
                onClick={() => router.push('/home')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition"
              >
                <ArrowLeft size={16} /> Back to Home
              </button>
            </div>
            <h1 className="text-4xl font-bold mb-4">Thumbnail Marketplace</h1>
            <p className="text-lg text-gray-400 max-w-2xl">
              Browse active tasks from creators looking for feedback. Vote on thumbnails to earn rewards and help creators boost their CTR.
            </p>
          </motion.div>

          {/* Stats Banner */}
          <motion.div
            variants={slideUp}
            className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-12 bg-[#181818] p-6 rounded-lg border border-gray-800"
          >
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="text-yellow-500" size={24} />
              </div>
              <div className="text-2xl font-bold">142</div>
              <div className="text-gray-400 text-sm">Active Tasks</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="text-blue-500" size={24} />
              </div>
              <div className="text-2xl font-bold">12.5k</div>
              <div className="text-gray-400 text-sm">Community Voters</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="text-green-500" size={24} />
              </div>
              <div className="text-2xl font-bold">485k</div>
              <div className="text-gray-400 text-sm">Tokens Rewarded</div>
            </div>
            <div className="hidden md:block text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="text-red-500" size={24} />
              </div>
              <div className="text-2xl font-bold">+32%</div>
              <div className="text-gray-400 text-sm">Avg. CTR Increase</div>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div variants={slideUp} className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Search by title, creator, or description..."
                  className="w-full bg-[#222222] border border-gray-800 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-2 bg-[#222222] hover:bg-[#2a2a2a] text-white px-4 py-3 rounded-lg transition"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={18} /> Filters
                </button>
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="appearance-none bg-[#222222] border border-gray-800 text-white rounded-lg py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            {/* Expandable filters */}
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 bg-[#1a1a1a] rounded-lg p-4 border border-gray-800"
              >
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm ${activeCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#222222] text-gray-300 hover:bg-[#2a2a2a]'
                        } transition`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Marketplace Grid */}
          {filteredTasks.length > 0 ? (
            <motion.div
              variants={staggerChildren}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  variants={slideUp}
                  className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition cursor-pointer group"
                  onClick={() => {
                    setisOpen(true)
                  setTaskId(task.id)}}
                >
                  <div className="relative">
                    <img src={task.image} alt={task.title} className="w-full aspect-video object-cover group-hover:opacity-90 transition" />
                    <div className="absolute top-2 left-2 bg-[#0f0f0f]/80 px-3 py-1 rounded-full text-xs flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div> {task.category}
                    </div>
                    <div className="absolute top-2 right-2 bg-[#0f0f0f]/80 px-3 py-1 rounded-full text-xs flex items-center">
                      <Clock size={12} className="mr-1" /> {task.timeLeft}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-[#0f0f0f]/80 px-3 py-1 rounded-full text-xs flex items-center">
                      <img src="/api/placeholder/16/16" className="w-4 h-4 rounded-full mr-1" /> {task.totalOptions} options
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-2 line-clamp-1">{task.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{task.description}</p>

                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <img src={task.creatorAvatar} alt={task.creator} className="w-6 h-6 rounded-full mr-2" />
                        <span className="text-sm text-gray-300">{task.creator}</span>
                      </div>
                      <button
                        className={`p-1.5 rounded-full ${task.liked ? 'text-red-500 bg-red-500/10' : 'text-gray-400 bg-[#222222] hover:text-red-500'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(task.id);
                        }}
                      >
                        <Heart size={16} fill={task.liked ? "currentColor" : "none"} />
                      </button>
                    </div>

                    <div className="flex justify-between text-sm">
                      <div className="flex items-center text-gray-300">
                        <ThumbsUp size={14} className="mr-1 text-blue-500" /> {task.votes} votes
                      </div>
                      <div className="flex items-center text-green-500">
                        <DollarSign size={14} className="mr-1" /> {task.reward} tokens
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div variants={slideUp} className="text-center py-16">
              <div className="text-gray-400 mb-4">No tasks found matching your criteria</div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="text-blue-500 hover:text-blue-400 transition"
              >
                Clear filters
              </button>
            </motion.div>
          )}

          {/* Pagination (simplified) */}
          {filteredTasks.length > 0 && (
            <motion.div variants={slideUp} className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-lg bg-[#222222] flex items-center justify-center text-gray-400 hover:bg-[#2a2a2a] transition">
                  1
                </button>
                <button className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  2
                </button>
                <button className="w-10 h-10 rounded-lg bg-[#222222] flex items-center justify-center text-gray-400 hover:bg-[#2a2a2a] transition">
                  3
                </button>
                <span className="text-gray-400">...</span>
                <button className="w-10 h-10 rounded-lg bg-[#222222] flex items-center justify-center text-gray-400 hover:bg-[#2a2a2a] transition">
                  8
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-[#0f0f0f] text-white py-8 px-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Youtube className="text-red-600" size={20} />
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
    {isOpen && <Modal isOpen={isOpen} onClose={() => setisOpen(false)} >
      <TaskInstructionsContent taskId = {taskId} />
    </Modal>}
  </>
}

export default MarketplacePage;