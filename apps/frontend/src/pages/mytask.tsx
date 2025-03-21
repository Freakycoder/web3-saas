import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Search, Filter, ArrowUpDown, Clock, DollarSign, ThumbsUp, PlusCircle, Trash2, Edit, Eye, BarChart, Users, Heart, ArrowLeft, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/router';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Navbar } from '@/components/Navbar';

const CreatedTasksPage = () => {
  const router = useRouter();
  const { connected, publicKey } = useWallet();
  const [isClient, setIsClient] = useState(false);
  
  // Filter and sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');
  const [sortOption, setSortOption] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  
  // Animation for background
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mock user created tasks data
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Batman vs Joker Thumbnail Choice",
      status: "Active",
      votes: 124,
      reward: 25,
      timeLeft: "2 days",
      image: "/api/placeholder/400/225",
      category: "Gaming",
      participants: 48,
      totalOptions: 3,
      description: "Need help deciding which thumbnail works best for my Batman gameplay video featuring the Joker boss fight.",
      createdAt: "Mar 9, 2025"
    },
    {
      id: 2,
      title: "Which Tech Review Thumbnail?",
      status: "Active",
      votes: 87,
      reward: 30,
      timeLeft: "1 day",
      image: "/api/placeholder/400/225",
      category: "Technology",
      participants: 32,
      totalOptions: 4,
      description: "Help me pick the best thumbnail for my new MacBook review - looking for maximum CTR.",
      createdAt: "Mar 8, 2025"
    },
    {
      id: 3,
      title: "Cooking Tutorial Cover Image",
      status: "Completed",
      votes: 156,
      reward: 20,
      timeLeft: "Ended",
      image: "/api/placeholder/400/225",
      category: "Food",
      participants: 67,
      totalOptions: 2,
      description: "Thanks everyone for helping choose my pasta recipe thumbnail! The winner increased my CTR by 32%.",
      createdAt: "Mar 5, 2025"
    },
    {
      id: 4,
      title: "Japan Travel Vlog Options",
      status: "Completed",
      votes: 92,
      reward: 15,
      timeLeft: "Ended",
      image: "/api/placeholder/400/225",
      category: "Travel",
      participants: 41,
      totalOptions: 5,
      description: "My Tokyo travel vlog thumbnail selection is complete. Thanks to everyone who participated!",
      createdAt: "Mar 2, 2025"
    },
    {
      id: 5,
      title: "Workout Series Thumbnail",
      status: "Draft",
      votes: 0,
      reward: 35,
      timeLeft: "Not started",
      image: "/api/placeholder/400/225",
      category: "Fitness",
      participants: 0,
      totalOptions: 3,
      description: "Preparing thumbnails for my new HIIT workout series. Will publish for voting soon.",
      createdAt: "Mar 10, 2025"
    }
  ]);

  // Statuses
  const statuses = [
    'All',
    'Active',
    'Completed',
    'Draft'
  ];

  // Sort options
  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'votes', label: 'Most Votes' },
    { value: 'participants', label: 'Most Participants' },
    { value: 'reward', label: 'Highest Reward' }
  ];

  // Delete task
  const deleteTask = (taskId : any) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  useEffect(() => {
    const handleMouseMove = (e : any) => {
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

  // Handle sorting
  useEffect(() => {
    let sortedTasks = [...tasks];
    
    switch (sortOption) {
      case 'reward':
        sortedTasks.sort((a, b) => b.reward - a.reward);
        break;
      case 'votes':
        sortedTasks.sort((a, b) => b.votes - a.votes);
        break;
      case 'participants':
        sortedTasks.sort((a, b) => b.participants - a.participants);
        break;
      case 'recent':
      default:
        // Using createdAt date
        sortedTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    
    setTasks(sortedTasks);
  }, [sortOption]);

  // Filter tasks based on search and status
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = activeStatus === 'All' || task.status === activeStatus;
    
    return matchesSearch && matchesStatus;
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

      {/* Navigation */}
      <Navbar/>

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
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition"
              >
                <ArrowLeft size={16} /> Back to Dashboard
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold mb-4">My Thumbnail Tasks</h1>
                <p className="text-lg text-gray-400 max-w-2xl">
                  Manage all the thumbnail voting tasks you've created. Track participation, see results, and create new tasks.
                </p>
              </div>
              <button 
                onClick={() => router.push('/create-task')}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition"
              >
                <PlusCircle size={18} /> Create New Task
              </button>
            </div>
          </motion.div>

          {/* Stats Banner */}
          <motion.div 
            variants={slideUp} 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 bg-[#181818] p-6 rounded-lg border border-gray-800"
          >
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="text-green-500" size={24} />
              </div>
              <div className="text-2xl font-bold">125</div>
              <div className="text-gray-400 text-sm">Tokens Spent</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="text-blue-500" size={24} />
              </div>
              <div className="text-2xl font-bold">188</div>
              <div className="text-gray-400 text-sm">Total Participants</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <ThumbsUp className="text-purple-500" size={24} />
              </div>
              <div className="text-2xl font-bold">459</div>
              <div className="text-gray-400 text-sm">Total Votes</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="text-red-500" size={24} />
              </div>
              <div className="text-2xl font-bold">+27%</div>
              <div className="text-gray-400 text-sm">Avg. CTR Boost</div>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div variants={slideUp} className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Search your tasks..."
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
                  {statuses.map(status => (
                    <button
                      key={status}
                      onClick={() => setActiveStatus(status)}
                      className={`px-4 py-2 rounded-full text-sm ${
                        activeStatus === status
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#222222] text-gray-300 hover:bg-[#2a2a2a]'
                      } transition`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Created Tasks Grid */}
          {filteredTasks.length > 0 ? (
            <motion.div 
              variants={staggerChildren} 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTasks.map((task) => (
                <motion.div 
                  key={task.id}
                  variants={slideUp}
                  className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800 transition group"
                >
                  <div className="relative">
                    <img src={task.image} alt={task.title} className="w-full aspect-video object-cover" />
                    
                    <div 
                      className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs flex items-center ${
                        task.status === 'Active' ? 'bg-green-500/20 text-green-400' : 
                        task.status === 'Completed' ? 'bg-blue-500/20 text-blue-400' : 
                        'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      <div 
                        className={`w-2 h-2 rounded-full mr-1 ${
                          task.status === 'Active' ? 'bg-green-500' : 
                          task.status === 'Completed' ? 'bg-blue-500' : 
                          'bg-gray-500'
                        }`}
                      ></div> 
                      {task.status}
                    </div>
                    
                    <div className="absolute top-2 right-2 bg-[#0f0f0f]/80 px-3 py-1 rounded-full text-xs flex items-center">
                      {task.status !== 'Draft' ? (
                        <>
                          <Clock size={12} className="mr-1" /> 
                          {task.timeLeft}
                        </>
                      ) : (
                        <>
                          <Edit size={12} className="mr-1" /> 
                          Draft
                        </>
                      )}
                    </div>
                    
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-3 flex justify-end gap-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/edit-task/${task.id}`);
                        }}
                        className="p-2 rounded-full bg-gray-800/90 hover:bg-gray-700/90 text-white transition"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTask(task.id);
                        }}
                        className="p-2 rounded-full bg-gray-800/90 hover:bg-red-600/90 text-white transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => router.push(`/task-details/${task.id}`)}
                  >
                    <h3 className="font-medium text-lg mb-2 line-clamp-1">{task.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{task.description}</p>
                    
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="flex flex-col items-center p-2 rounded-lg bg-[#222222]">
                        <Users size={14} className="mb-1 text-blue-400" />
                        <span className="text-sm font-medium">{task.participants}</span>
                        <span className="text-xs text-gray-400">Users</span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-lg bg-[#222222]">
                        <ThumbsUp size={14} className="mb-1 text-purple-400" />
                        <span className="text-sm font-medium">{task.votes}</span>
                        <span className="text-xs text-gray-400">Votes</span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-lg bg-[#222222]">
                        <DollarSign size={14} className="mb-1 text-green-400" />
                        <span className="text-sm font-medium">{task.reward}</span>
                        <span className="text-xs text-gray-400">Tokens</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-400">
                      <div className="flex items-center">
                        <Clock size={12} className="mr-1" /> Created: {task.createdAt}
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/task-analytics/${task.id}`);
                          }}
                          className="flex items-center text-blue-400 hover:text-blue-300 transition"
                        >
                          <BarChart size={12} className="mr-1" /> Analytics
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/task-preview/${task.id}`);
                          }}
                          className="flex items-center text-gray-400 hover:text-white transition"
                        >
                          <Eye size={12} className="mr-1" /> Preview
                        </button>
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
                  setActiveStatus('All');
                }}
                className="text-blue-500 hover:text-blue-400 transition"
              >
                Clear filters
              </button>
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
  );
}

export default CreatedTasksPage;