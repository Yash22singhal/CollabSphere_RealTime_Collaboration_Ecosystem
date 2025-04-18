import React, { useState } from "react";
import FeatureCard from "./FeatureCard"; // Import FeatureCard
import DemoPreview from "./DemoPreview"; // Import DemoPreview

const DemoSection = () => {
  const [activeDemo, setActiveDemo] = useState(0);

  const features = [
    {
      icon: "fa-users",
      title: "Multi-User Editing",
      description:
        "Multiple team members can edit the same document simultaneously with real-time cursor tracking and changes synchronization.",
    },
    {
      icon: "fa-magic",
      title: "Smart Suggestions",
      description:
        "AI-powered writing assistance provides context-aware suggestions for better content quality and consistency.",
    },
    {
      icon: "fa-history",
      title: "Version History",
      description:
        "Track all changes with detailed version history, including who made what changes and when.",
    },
  ];

  return (
    <section id="demo" className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">
          Experience Real-Time Collaboration
        </h2>
        <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
          Watch how teams collaborate seamlessly with AI-powered suggestions,
          real-time editing, and version control.
        </p>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Demo Preview Component */}
          <DemoPreview activeDemo={activeDemo} />

          {/* Feature Cards */}
          <div>
            <div className="space-y-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  feature={feature}
                  isActive={activeDemo === index}
                  onClick={() => setActiveDemo(index)}
                />
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap">
                <i className="fas fa-play-circle mr-2"></i>
                Watch Full Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
