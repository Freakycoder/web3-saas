import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Youtube, DollarSign, ArrowRight, Info, Lock, Settings, Headset, ChevronDown, ChevronUp, Activity, Wallet, Play, Image, ThumbsUp, Eye, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/router';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';

const LandingPage = () => {
  const router = useRouter();
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef(null);
  const { connected, signMessage, publicKey } = useWallet();
  const [isclient, setIsClient] = useState(false);

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
    const authenticateUser = async () => {

      try {
        if (!connected || !publicKey || !signMessage) return

        const message = new TextEncoder().encode("Sign into mechanical turks");

        const signature = await signMessage(message).catch((error: any) => {
          if (error.code === 4001 || error.message.includes("User rejected the request")) {
            console.log("User rejected the wallet signature request. No action needed.");
            return null; // Stop execution
          }
          throw error;
        });

        if (!signature) return

        const response = await axios.post('http://localhost:3001/v1/user/connected', {
          signature: signature,
          publicKey: publicKey
        })

        console.log(response.data.token);
        localStorage.setItem('token', response.data.token);
        console.log("token recieved");
      }
      catch (e) {
        console.error("Wallet authentication failed:", e);
      }
    }
    authenticateUser();
    setIsClient(true);

    return () => {
      window.addEventListener('mousemove', handleMouseMove);
    };
  }, [connected]);

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
      image: "/api/placeholder/400/225"
    },
    {
      title: "Best YouTube Secrets Revealed",
      views: "850K views",
      ctr: "9.7%",
      image: "/api/placeholder/400/225"
    },
    {
      title: "How I Made $100K on YouTube",
      views: "2.4M views",
      ctr: "14.1%",
      image: "/api/placeholder/400/225"
    },
    {
      title: "Ultimate Thumbnail Guide 2025",
      views: "1.5M views",
      ctr: "11.8%",
      image: "/api/placeholder/400/225"
    },
    {
      title: "YouTube Algorithm Hacks",
      views: "3.2M views",
      ctr: "15.3%",
      image: "/api/placeholder/400/225"
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
      <nav className="w-full bg-[#0f0f0f] border-b border-gray-800 py-4 px-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <Youtube className="text-red-600" size={24} />
          <span className="text-xl font-bold">ThumbBoost</span>
        </div>

        <div className="flex items-center gap-4">
          <a href="#benefits" className="text-gray-300 hover:text-white">Dashboard</a>
          <a href="#carousel" className="text-gray-300 hover:text-white">Gallery</a>
          <a href="#benefits" className="text-gray-300 hover:text-white">Profile</a>
          {isclient && (
            <WalletMultiButton className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition">
              <div className='flex gap-2 items-center'>
                <Wallet size={18} />
                <span>Connect</span>
              </div>
            </WalletMultiButton>
          )}
        </div>
      </nav>

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
          <button
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition"
            onClick={() => router.push('/home')}
          >
            Get Started <ArrowRight size={18} />
          </button>
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
                    className={`min-w-[20%] px-2 transition-opacity duration-300 ${index === activeSlide ? 'opacity-100 scale-105' : 'opacity-80'
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
                          <div className="flex items-center">
                            <ThumbsUp size={12} className="mr-1" /> Community Pick
                          </div>
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

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-6 gap-2">
              {thumbnails.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${index === activeSlide ? 'bg-red-600' : 'bg-gray-600'
                    }`}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
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