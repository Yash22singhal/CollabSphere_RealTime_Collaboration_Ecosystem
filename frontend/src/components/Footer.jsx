// import React from "react";

// const Footer = () => {
//   return (
//     <footer className="bg-gray-900 text-white py-16 px-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
//           <div>
//             <h3 className="text-xl font-bold mb-4">CollabSphere</h3>
//             <p className="text-gray-400 mb-4">
//               Transforming document collaboration with AI-powered intelligence.
//             </p>
//             <div className="flex space-x-4">
//               <a
//                 href="#"
//                 className="text-gray-400 hover:text-white cursor-pointer"
//               >
//                 <i className="fab fa-twitter text-xl"></i>
//               </a>
//               <a
//                 href="#"
//                 className="text-gray-400 hover:text-white cursor-pointer"
//               >
//                 <i className="fab fa-linkedin text-xl"></i>
//               </a>
//               <a
//                 href="#"
//                 className="text-gray-400 hover:text-white cursor-pointer"
//               >
//                 <i className="fab fa-github text-xl"></i>
//               </a>
//             </div>
//           </div>
//           <div>
//             <h4 className="text-lg font-semibold mb-4">Product</h4>
//             <ul className="space-y-2">
//               <li>
//                 <a
//                   href="#"
//                   className="text-gray-400 hover:text-white cursor-pointer"
//                 >
//                   Features
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="#"
//                   className="text-gray-400 hover:text-white cursor-pointer"
//                 >
//                   Pricing
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="#"
//                   className="text-gray-400 hover:text-white cursor-pointer"
//                 >
//                   Security
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="#"
//                   className="text-gray-400 hover:text-white cursor-pointer"
//                 >
//                   Enterprise
//                 </a>
//               </li>
//             </ul>
//           </div>
//           <div>
//             <h4 className="text-lg font-semibold mb-4">Resources</h4>
//             <ul className="space-y-2">
//               <li>
//                 <a
//                   href="#"
//                   className="text-gray-400 hover:text-white cursor-pointer"
//                 >
//                   Documentation
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="#"
//                   className="text-gray-400 hover:text-white cursor-pointer"
//                 >
//                   API Reference
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="#"
//                   className="text-gray-400 hover:text-white cursor-pointer"
//                 >
//                   Blog
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="#"
//                   className="text-gray-400 hover:text-white cursor-pointer"
//                 >
//                   Community
//                 </a>
//               </li>
//             </ul>
//           </div>
//           <div>
//             <h4 className="text-lg font-semibold mb-4">Subscribe</h4>
//             <p className="text-gray-400 mb-4">
//               Get the latest updates and news directly in your inbox.
//             </p>
//             <div className="flex">
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="px-4 py-2 bg-gray-800 text-white rounded-l-lg border-none focus:outline-none"
//               />
//               <button className="px-4 py-2 bg-blue-600 text-white !rounded-button hover:bg-blue-700 cursor-pointer whitespace-nowrap">
//                 Subscribe
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
//           <p>&copy; 2025 CollabSphere. All rights reserved.</p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;







import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Branding */}
          <section>
            <h3 className="text-2xl font-bold mb-4 text-white">CollabSphere</h3>
            <p className="text-gray-400 mb-4">
              Transforming document collaboration with AI-powered intelligence.
            </p>
            <div className="flex space-x-4 mt-2">
              <a href="#" aria-label="Twitter" className="hover:text-blue-400">
                <i className="fab fa-twitter text-xl text-gray-400 hover:text-white"></i>
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-blue-500">
                <i className="fab fa-linkedin text-xl text-gray-400 hover:text-white"></i>
              </a>
              <a href="#" aria-label="GitHub" className="hover:text-gray-300">
                <i className="fab fa-github text-xl text-gray-400 hover:text-white"></i>
              </a>
            </div>
          </section>

          {/* Product Links */}
          <section>
            <h4 className="text-lg font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {["Features", "Pricing", "Security", "Enterprise"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* Resources Links */}
          <section>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {["Documentation", "API Reference", "Blog", "Community"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </section>

          {/* Subscribe */}
          <section>
            <h4 className="text-lg font-semibold mb-4">Subscribe</h4>
            <p className="text-gray-400 mb-4">
              Get the latest updates and news directly in your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 mb-2 sm:mb-0 sm:mr-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </form>
          </section>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} CollabSphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
