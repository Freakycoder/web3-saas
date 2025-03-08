import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Youtube, ArrowRight, Plus, Search, TrendingUp, Star, DollarSign, Clock } from 'lucide-react';
import { useRouter } from 'next/router';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

const HomePage = () => {
  const router = useRouter();
  const { connected, publicKey } = useWallet();
  const [isClient, setIsClient] = useState(false);
  
  // Animation for background
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Featured tasks in marketplace
  const featuredTasks = [
    {
      id: 1,
      title: "Gaming Channel Thumbnail Review",
      creator: "GamerPro",
      votes: 124,
      reward: 25,
      timeLeft: "2 days",
      image: "/api/placeholder/400/225"
    },
    {
      id: 2,
      title: "Tech Review Thumbnail Options",
      creator: "TechGenius",
      votes: 87,
      reward: 30,
      timeLeft: "1 day",
      image: "/api/placeholder/400/225"
    },
    {
      id: 3,
      title: "Food Blog Thumbnail Selection",
      creator: "CookingMaster",
      votes: 156,
      reward: 20,
      timeLeft: "3 days",
      image: "/api/placeholder/400/225"
    }
  ];

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

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
      <nav className="w-full bg-[#0f0f0f] border-b border-gray-800 py-4 px-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <Youtube className="text-red-600" size={24} />
          <span className="text-xl font-bold">ThumbBoost</span>
        </div>

        <div className="flex items-center gap-4">
          <a href="#" className="text-gray-300 hover:text-white">Dashboard</a>
          <a href="#marketplace" className="text-gray-300 hover:text-white">Marketplace</a>
          <a href="#" className="text-gray-300 hover:text-white">Profile</a>
          {isClient && (
            <WalletMultiButton className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition">
              <div className='flex gap-2 items-center'>
                <span>Wallet</span>
              </div>
            </WalletMultiButton>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <motion.div
        className="relative px-8 py-20"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="max-w-6xl mx-auto">
          {/* Welcome Header */}
          <motion.div variants={slideUp} className="mb-16 text-center">
            <h1 className="text-4xl font-bold mb-6">Welcome to ThumbBoost</h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Ready to boost your YouTube presence? Choose an option below to get started on your thumbnail optimization journey.
            </p>
          </motion.div>

          {/* Option Cards */}
          <motion.div variants={staggerChildren} className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Create New Task Card */}
            <motion.div 
              variants={slideUp} 
              className="bg-[#181818] rounded-xl border border-gray-800 hover:border-red-600 transition overflow-hidden cursor-pointer"
              onClick={() => router.push('/create-task')}
            >
              <div className="p-8">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-600/20 mb-6">
                  <Plus size={24} className="text-red-500" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
                <p className="text-gray-400 mb-6">
                  Upload your thumbnails and let our community vote on the best option to improve your CTR and viewer engagement.
                </p>
                <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition">
                  Create Task <ArrowRight size={18} />
                </button>
              </div>
              <div className="h-2 bg-gradient-to-r from-red-600 to-red-400"></div>
            </motion.div>

            {/* Explore Marketplace Card */}
            <motion.div 
              variants={slideUp} 
              className="bg-[#181818] rounded-xl border border-gray-800 hover:border-blue-600 transition overflow-hidden cursor-pointer"
              onClick={() => router.push('/marketplace')}
            >
              <div className="p-8">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20 mb-6">
                  <Search size={24} className="text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Explore Marketplace</h2>
                <p className="text-gray-400 mb-6">
                  Browse and vote on other creators' thumbnail options to earn rewards and help the community grow together.
                </p>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition">
                  View Marketplace <ArrowRight size={18} />
                </button>
              </div>
              <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400"></div>
            </motion.div>
          </motion.div>

          {/* Featured Tasks Section */}
          <motion.section 
            id="marketplace" 
            className="mt-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
          >
            <motion.div variants={slideUp} className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                  <span className="text-blue-400 font-medium">FEATURED TASKS</span>
                </div>
                <h2 className="text-3xl font-bold">Trending in the Marketplace</h2>
              </div>
              <button className="text-gray-400 hover:text-white transition flex items-center gap-2">
                View All <ArrowRight size={16} />
              </button>
            </motion.div>

            <motion.div variants={fadeIn} className="grid md:grid-cols-3 gap-6">
              {featuredTasks.map((task) => (
                <motion.div 
                  key={task.id}
                  variants={slideUp}
                  className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition cursor-pointer"
                >
                  <div className="relative">
                    <img src={task.image} alt={task.title} className="w-full aspect-video object-cover" />
                    <div className="absolute top-2 right-2 bg-[#0f0f0f]/80 px-3 py-1 rounded-full text-xs flex items-center">
                      <Clock size={12} className="mr-1" /> {task.timeLeft}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-2">{task.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">By {task.creator}</p>
                    
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center text-gray-300">
                        <Star size={14} className="mr-1 text-yellow-500" /> {task.votes} votes
                      </div>
                      <div className="flex items-center text-green-500">
                        <DollarSign size={14} className="mr-1" /> {task.reward} tokens
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.section
        className="py-16 px-8 bg-[#181818] border-t border-gray-800 mt-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">New to ThumbBoost?</h2>
          <p className="text-gray-400 mb-6">
            Learn how our platform works and discover strategies to maximize your thumbnail effectiveness.
          </p>
          <button className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-6 py-3 rounded-lg transition flex items-center gap-2 mx-auto">
            <TrendingUp size={18} /> Watch Tutorial
          </button>
        </div>
      </motion.section>

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

export default HomePage;