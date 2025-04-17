import React from "react";

const Hero = () => {
  return (
    <section className="pt-24 pb-16 px-4 relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-[url(https://readdy.ai/api/search-image?query=modern%20abstract%20technology%20background%20with%20soft%20gradient%20blue%20and%20purple%20colors%20perfect%20for%20text%20overlay%20minimal%20clean%20design&width=1440&height=800&seq=4&orientation=landscape&flag=0af8772811d7a1e6ffc5cc88f85961dc)] bg-cover bg-center"
      ></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-5xl font-bold leading-tight mb-6 text-white">
              Transform Collaboration with AI-Powered Real-Time Documents
            </h1>
            <p className="text-xl text-gray-100 mb-8">
              Experience the future of document collaboration with intelligent
              assistance, real-time co-editing, and enterprise-grade security.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://readdy.ai/home/bbee03c9-0601-48b2-836b-87d1f436b764/0dda1f9f-5304-4811-8d17-94459611cb83"
                data-readdy="true"
              >
                <button className="px-8 py-3 bg-white text-blue-600 !rounded-button hover:bg-gray-100 cursor-pointer whitespace-nowrap">
                  Get Started Free
                </button>
              </a>
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white !rounded-button hover:bg-white/10 cursor-pointer whitespace-nowrap">
                <i className="fas fa-play-circle mr-2"></i>
                Watch Demo
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="https://public.readdy.ai/ai/img_res/ebec7aca37c5e3de77420fd34a6394b3.jpg"
              alt="CollabSphere Platform"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
