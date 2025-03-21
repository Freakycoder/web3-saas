import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Youtube, ArrowRight, Info, Lock, Settings, Headset, ChevronDown, ChevronUp, Activity, Wallet, Play, Image, ThumbsUp, Eye, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/router';
import { useWallet } from '@solana/wallet-adapter-react';
import { Navbar } from '@/components/Navbar';

const user = { name: "Alex Johnson", email: "alex@example.com", username: "alexcreator" }

const LandingPage = () => {
  const router = useRouter();
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef(null);

  const isClient = typeof window !== 'undefined';

  // Carousel autoplay control
  const [isPaused, setIsPaused] = useState(false);

  // Animation for background
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.addEventListener('mousemove', handleMouseMove);
    };
  },);

  // For carousel autoplay
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isPaused && carouselRef.current) {
        setActiveSlide((prev) => (prev + 1) % 5);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [isPaused]);

  const toggleQuestion = (index: any) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

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

  // Thumbnail examples for the carousel
  const thumbnails = [
    {
      title: "10X Your Channel Growth",
      views: "1.2M views",
      ctr: "12.4%",
      image: "data:image/jpeg;base64,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"
    },
    {
      title: "Best YouTube Secrets Revealed",
      views: "850K views",
      ctr: "9.7%",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnJjpmBiQwAOL74r0CBVQ-y_8Rv0WulaPVLw&s"
    },
    {
      title: "How I Made $100K on YouTube",
      views: "2.4M views",
      ctr: "14.1%",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp91mofXYaK8RLg8wYKiFzIhiRNuiHabvtjg&s"
    },
    {
      title: "Ultimate Thumbnail Guide 2025",
      views: "1.5M views",
      ctr: "11.8%",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgszHwLkaj9nla5y7yENJf1sPkyjw9B1fVVQ&s"
    },
    {
      title: "YouTube Algorithm Hacks",
      views: "3.2M views",
      ctr: "15.3%",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYocwUuoNMoFuMRZAbojNEQWf6P5-qBbrX3A&s"
    }
  ];

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

      {/* Hero Section */}
      <motion.section
        className="relative px-8 py-20 flex flex-col items-center text-center"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <motion.div
          className="absolute -z-10 left-0 top-0 w-full h-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          {/* Background decorative elements handled by the animated divs above */}
        </motion.div>

        <motion.div
          className="bg-red-900/30 text-red-400 border border-red-700/50 px-4 py-1 rounded-full text-sm font-medium mb-8"
          variants={slideUp}
        >
          50,000+ YouTube Creators Trust Us
        </motion.div>

        <motion.h1
          className="text-5xl font-normal mb-6 max-w-4xl"
          variants={slideUp}
        >
          Ready to <span className="font-normal italic">scale</span> your channel with better thumbnails?
        </motion.h1>

        <motion.p
          className="text-lg text-gray-400 max-w-2xl mb-10"
          variants={slideUp}
        >
          Boost your YouTube CTR with ThumbBoost, the Web3-powered marketplace where content creators leverage community feedback to select winning thumbnails that drive more clicks.
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          variants={slideUp}
        >
          <button className="flex items-center gap-2 bg-[#272727] hover:bg-[#3d3d3d] text-white px-6 py-3 rounded-lg transition">
            <Info size={18} /> How It Works
          </button>
          <motion.button
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition hover:scale-105"
            onClick={() => router.push('/home')}
            whileTap={{scale : 0.8 , transition : {duration : 0.1}}}
            
          >
            Get Started <ArrowRight size={18} />
          </motion.button>
        </motion.div>

        <motion.div
          className="mt-6 text-gray-500 text-sm"
          variants={slideUp}
        >
          *No long-term commitment, pay only for what you use*
        </motion.div>
        <motion.div
          className="text-gray-500 text-sm"
          variants={slideUp}
        >
          *Average CTR increase of 32% for creators using our platform*
        </motion.div>

        <motion.div
          className="mt-16"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
        >
          <ChevronDown size={24} className="text-gray-400" />
        </motion.div>
      </motion.section>

      {/* Thumbnail Carousel Section */}
      <section id="carousel" className="py-16 px-8 bg-[#121212] relative overflow-hidden">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerChildren}
        >
          <motion.div variants={slideUp} className="flex items-center gap-2 mb-4">
            <div className="text-red-500 font-medium">TRENDING THUMBNAILS</div>
          </motion.div>

          <motion.h2 variants={slideUp} className="text-4xl font-bold mb-6">High-Performing Examples</motion.h2>

          <motion.p variants={slideUp} className="text-lg text-gray-400 max-w-3xl mb-12">
            Browse through our gallery of community-selected thumbnails that have helped creators boost their CTR and channel growth.
          </motion.p>

          {/* Carousel */}
          <motion.div
            variants={slideUp}
            className="relative"
            ref={carouselRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="flex overflow-hidden relative">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeSlide * 20}%)` }}
              >
                {thumbnails.map((thumb, index) => (
                  <div
                    key={index}
                    className={`min-w-[30%] px-2 transition-opacity duration-300 ${index === activeSlide ? 'opacity-100 scale-105' : 'opacity-80'
                      }`}
                  >
                    <div className="bg-[#1e1e1e] rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition">
                      <div className="relative">
                        <img src={thumb.image} alt={thumb.title} className="w-full aspect-video object-cover" />
                        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs flex items-center">
                          <Eye size={12} className="mr-1" /> {thumb.views}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-sm mb-2">{thumb.title}</h3>
                        <div className="flex justify-between text-xs text-gray-400">
                          
                          <div className="flex items-center text-green-500">
                            <TrendingUp size={12} className="mr-1" /> CTR: {thumb.ctr}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-8 bg-[#181818]">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerChildren}
        >
          <motion.div variants={slideUp} className="flex items-center gap-2 mb-4">
            <div className="text-red-500 font-medium">BENEFITS</div>
          </motion.div>

          <motion.h2 variants={slideUp} className="text-4xl font-bold mb-6">Why Creators Choose Us</motion.h2>

          <motion.p variants={slideUp} className="text-lg text-gray-400 max-w-3xl mb-16">
            Leverage the power of Web3 and community feedback to create thumbnails that convert, helping you grow your YouTube channel faster than ever.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div variants={slideUp} className="bg-[#222222] p-8 rounded-lg border border-gray-800 hover:border-gray-700 transition">
              <div className="mb-6 text-2xl">
                <ThumbsUp className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Community Voting</h3>
              <p className="text-gray-400">
                Get real feedback from actual viewers who vote on your thumbnails, ensuring you pick options that resonate with your target audience.
              </p>
            </motion.div>

            <motion.div variants={slideUp} className="bg-[#222222] p-8 rounded-lg border border-gray-800 hover:border-gray-700 transition">
              <div className="mb-6 text-2xl">
                <TrendingUp className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4">CTR Analytics</h3>
              <p className="text-gray-400">
                Access detailed performance reports and intelligent insights about your thumbnails to make data-driven decisions for future content.
              </p>
            </motion.div>

            <motion.div variants={slideUp} className="bg-[#222222] p-8 rounded-lg border border-gray-800 hover:border-gray-700 transition">
              <div className="mb-6 text-2xl">
                <Wallet className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Web3 Rewards</h3>
              <p className="text-gray-400">
                Community members earn tokens for providing valuable feedback, creating a sustainable ecosystem that benefits both creators and voters.
              </p>
            </motion.div>

            <motion.div variants={slideUp} className="bg-[#222222] p-8 rounded-lg border border-gray-800 hover:border-gray-700 transition">
              <div className="mb-6 text-2xl">
                <Lock className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Secure Platform</h3>
              <p className="text-gray-400">
                Your thumbnails and data are protected with blockchain technology, ensuring transparency and security throughout the process.
              </p>
            </motion.div>

            <motion.div variants={slideUp} className="bg-[#222222] p-8 rounded-lg border border-gray-800 hover:border-gray-700 transition">
              <div className="mb-6 text-2xl">
                <Settings className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Enhancement</h3>
              <p className="text-gray-400">
                Our AI tools can suggest improvements based on successful thumbnails in your niche, giving you a competitive edge on the platform.
              </p>
            </motion.div>

            <motion.div variants={slideUp} className="bg-[#222222] p-8 rounded-lg border border-gray-800 hover:border-gray-700 transition">
              <div className="mb-6 text-2xl">
                <Headset className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Creator Support</h3>
              <p className="text-gray-400">
                Access personalized assistance from our team of YouTube experts, helping you understand what makes a high-performing thumbnail for your niche.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Product Highlight Section */}
      <section className="py-20 px-8 bg-[#121212]">
        <motion.div
          className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerChildren}
        >
          <motion.div variants={slideUp} className="order-2 md:order-1">
            <div className="bg-[#222222] p-6 rounded-lg border border-gray-800">
              <h3 className="text-xl font-semibold mb-4">Thumbnail Analytics</h3>
              <div className="aspect-square relative rounded-lg overflow-hidden bg-[#1a1a1a] p-4">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path d="M10,80 Q30,75 40,65 T60,40 Q70,30 90,20" fill="none" stroke="#444" strokeWidth="2" />
                  <path d="M10,80 Q30,75 40,65 T60,40 Q70,30 90,20" fill="none" stroke="#f00" strokeWidth="2" strokeDasharray="5,5" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div variants={slideUp} className="order-1 md:order-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-4 rounded-full bg-red-600"></div>
              <span className="text-red-400 font-medium">Analytics</span>
            </div>

            <h2 className="text-3xl font-bold mb-6">Real-Time CTR Insights</h2>

            <p className="text-gray-400 mb-8">
              Track your thumbnail performance with detailed analytics and community ratings, giving you full transparency and control over your YouTube growth strategy.
            </p>

            <button
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition"
              onClick={() => router.push('/get-started')}
            >
              Try It Now <ArrowRight size={18} />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-8 bg-[#181818] border-t border-gray-800">
        <motion.div
          className="max-w-3xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerChildren}
        >
          <motion.h2 variants={slideUp} className="text-3xl font-bold text-center mb-4">Common Questions</motion.h2>
          <motion.p variants={slideUp} className="text-center text-gray-400 mb-12">
            We're here to help you understand how our platform can boost your YouTube presence. Find answers to frequently asked questions below.
          </motion.p>

          <motion.div variants={slideUp} className="bg-[#222222] rounded-xl p-6 border border-gray-800">
            <div className="space-y-4">
              <div className="border-b border-gray-800 pb-4">
                <button
                  className="w-full flex justify-between items-center text-left"
                  onClick={() => toggleQuestion(0)}
                >
                  <h3 className="font-medium">How does the thumbnail voting work?</h3>
                  {activeQuestion === 0 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {activeQuestion === 0 && (
                  <div className="mt-4 text-gray-400">
                    Upload 2-5 thumbnail options, and our community of verified viewers will vote on which one they'd be most likely to click. Voting is weighted based on voter reputation and demographic match to your target audience.
                  </div>
                )}
              </div>

              <div className="border-b border-gray-800 pb-4">
                <button
                  className="w-full flex justify-between items-center text-left"
                  onClick={() => toggleQuestion(1)}
                >
                  <h3 className="font-medium">What blockchain technology do you use?</h3>
                  {activeQuestion === 1 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {activeQuestion === 1 && (
                  <div className="mt-4 text-gray-400">
                    ThumbBoost uses a Layer 2 Ethereum solution for fast, low-cost transactions. We've designed our smart contracts to handle voting verification, token distribution, and reputation management efficiently.
                  </div>
                )}
              </div>

              <div className="border-b border-gray-800 pb-4">
                <button
                  className="w-full flex justify-between items-center text-left"
                  onClick={() => toggleQuestion(2)}
                >
                  <h3 className="font-medium">How long does the voting process take?</h3>
                  {activeQuestion === 2 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {activeQuestion === 2 && (
                  <div className="mt-4 text-gray-400">
                    Most thumbnails receive sufficient votes within 24-48 hours. Our express option guarantees at least 100 targeted votes within 6 hours, perfect for time-sensitive video launches.
                  </div>
                )}
              </div>

              <div className="border-b border-gray-800 pb-4">
                <button
                  className="w-full flex justify-between items-center text-left"
                  onClick={() => toggleQuestion(3)}
                >
                  <h3 className="font-medium">Do I need cryptocurrency to use the platform?</h3>
                  {activeQuestion === 3 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {activeQuestion === 3 && (
                  <div className="mt-4 text-gray-400">
                    While our platform is built on Web3 technology, we offer both crypto and traditional payment options. You can connect a wallet for the full experience or use credit card payments with our simplified onboarding process.
                  </div>
                )}
              </div>

              <div className="border-b border-gray-800 pb-4">
                <button
                  className="w-full flex justify-between items-center text-left"
                  onClick={() => toggleQuestion(4)}
                >
                  <h3 className="font-medium">How accurate are the CTR predictions?</h3>
                  {activeQuestion === 4 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {activeQuestion === 4 && (
                  <div className="mt-4 text-gray-400">
                    Our community votes have shown a strong correlation with actual YouTube performance. On average, thumbnails selected through our platform perform 32% better than creators' initial choices, with a prediction accuracy of around 83%.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Call to Action */}
      <motion.section
        className="py-20 px-8 bg-[#0f0f0f]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Boost Your YouTube CTR?</h2>
          <p className="text-lg text-gray-400 mb-8">
            Join thousands of content creators who have increased their click-through rates with community-powered thumbnail selection.
          </p>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg transition"
            onClick={() => router.push('/get-started')}
          >
            Start Creating Now
          </button>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-[#0f0f0f] text-white py-12 px-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Youtube className="text-red-600" size={24} />
              <span className="text-xl font-bold">ThumbBoost</span>
            </div>
            <p className="text-gray-400">
              The Web3-powered thumbnail marketplace for YouTube creators looking to maximize their CTR.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">How It Works</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Creator Dashboard</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Voter Program</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Thumbnail Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">CTR Academy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Case Studies</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Support Center</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Web3 Mission</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Legal</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-800 text-gray-400 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>© 2025 ThumbBoost. All rights reserved.</div>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Token Disclosure</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;