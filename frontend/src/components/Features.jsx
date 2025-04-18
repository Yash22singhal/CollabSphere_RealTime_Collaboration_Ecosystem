// import React from "react";
// import { motion } from "framer-motion";

// const Hero = () => {
//   return (
//     <section className="pt-28 pb-20 px-6 md:px-12 relative overflow-hidden bg-gradient-to-tr from-[#1A1A40] to-[#2E8BC0]">
//       {/* Background Image Overlay */}
//       <div className="absolute inset-0 z-0 bg-[url('https://readdy.ai/api/search-image?query=modern%20abstract%20technology%20background%20with%20soft%20gradient%20blue%20and%20purple%20colors&width=1440&height=800&seq=4&orientation=landscape')] bg-cover bg-center opacity-30"></div>

//       {/* Hero Content */}
//       <div className="max-w-7xl mx-auto relative z-10">
//         <div className="grid md:grid-cols-2 gap-12 items-center">
          
//           {/* Text Area */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7 }}
//             className="backdrop-blur-xl bg-white/10 p-10 rounded-3xl shadow-xl"
//           >
//             <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-white">
//               Transform Collaboration with AI-Powered Real-Time Documents
//             </h1>
//             <p className="text-lg md:text-xl text-gray-200 mb-8">
//               Experience the future of document collaboration with intelligent
//               assistance, real-time co-editing, and enterprise-grade security.
//             </p>

//             <div className="flex flex-wrap gap-4">
//               <a
//                 href="https://readdy.ai/home/bbee03c9-0601-48b2-836b-87d1f436b764/0dda1f9f-5304-4811-8d17-94459611cb83"
//                 data-readdy="true"
//               >
//                 <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow hover:bg-gray-100 transition duration-200">
//                   Get Started Free
//                 </button>
//               </a>
//               <button className="px-6 py-3 bg-transparent border border-white text-white font-semibold rounded-xl hover:bg-white/10 transition duration-200 flex items-center">
//                 <i className="fas fa-play-circle mr-2 text-xl"></i>
//                 Watch Demo
//               </button>
//             </div>
//           </motion.div>

//           {/* Image */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.3, duration: 0.6 }}
//             className="hidden md:block"
//           >
//             <img
//               src="https://public.readdy.ai/ai/img_res/ebec7aca37c5e3de77420fd34a6394b3.jpg"
//               alt="CollabSphere Platform"
//               className="w-full h-auto rounded-2xl shadow-lg"
//             />
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;





import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSyncAlt,
  faBolt,
  faLock,
  faBrain,
} from "@fortawesome/free-solid-svg-icons";

const features = [
  {
    icon: faSyncAlt,
    title: "Real-Time Sync",
    desc: "Collaborate with your team instantly. Every edit is reflected live across all devices.",
  },
  {
    icon: faBolt,
    title: "Lightning Fast",
    desc: "Optimized for speed and performance to keep your workflow smooth and uninterrupted.",
  },
  {
    icon: faLock,
    title: "Enterprise Security",
    desc: "Advanced encryption and access controls to protect your sensitive data.",
  },
  {
    icon: faBrain,
    title: "Smart AI Assistance",
    desc: "AI-driven suggestions to speed up tasks and enhance document quality effortlessly.",
  },
];

const Features = () => {
  return (
    <section id="features" className="relative z-10 py-20 px-6 md:px-12 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features Built for Teams
          </h2>
          <p className="text-gray-300 text-lg md:text-xl">
            Explore the tools that make collaboration seamless and secure.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center shadow hover:shadow-xl transition-all duration-300 hover:bg-white/20"
            >
              <div className="text-4xl text-blue-400 mb-4">
                <FontAwesomeIcon icon={feature.icon} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-200 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
