import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="pt-28 pb-20 px-6 md:px-12 relative overflow-hidden bg-gradient-to-tr from-[#2E8BC0] via-[#0C2D48] to-gray-900">
      <div className="absolute inset-0 z-0 bg-[url('https://readdy.ai/api/search-image?query=modern%20abstract%20technology%20background%20with%20soft%20gradient%20blue%20and%20purple%20colors&width=1440&height=800&seq=4&orientation=landscape')] bg-cover bg-center opacity-30"></div>

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Text Area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="backdrop-blur-xl bg-white/10 p-8 md:p-10 rounded-3xl shadow-xl"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-white">
              Transform Collaboration with AI-Powered Real-Time Documents
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-200 mb-8">
              Experience the future of document collaboration with intelligent
              assistance, real-time co-editing, and enterprise-grade security.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="/">
                <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow hover:bg-gray-100 transition duration-200">
                  Get Started Free
                </button>
              </a>
              <button className="px-6 py-3 bg-transparent border border-white text-white font-semibold rounded-xl hover:bg-white/10 transition duration-200 flex items-center">
                <i className="fas fa-play-circle mr-2 text-xl"></i>
                Watch Demo
              </button>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="hidden md:block"
          >
            <img
              src="https://public.readdy.ai/ai/img_res/ebec7aca37c5e3de77420fd34a6394b3.jpg"
              alt="CollabSphere Platform"
              className="w-full h-auto rounded-2xl shadow-lg"
            />
          </motion.div>

          {/* Image for Mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="md:hidden"
          >
            <img
              src="https://public.readdy.ai/ai/img_res/ebec7aca37c5e3de77420fd34a6394b3.jpg"
              alt="CollabSphere Platform"
              className="w-full h-auto rounded-2xl shadow-lg"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
