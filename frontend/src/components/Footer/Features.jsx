import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBrain, faBolt, faCodeBranch, faShieldAlt} from "@fortawesome/free-solid-svg-icons";

const Features = () => {
  return (
    <section id="features" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
          Powerful Features for Modern Teams
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: "faBrain",
              title: "AI-Powered Collaboration",
              description:
                "Smart suggestions and automated workflows powered by advanced AI",
            },
            {
              icon: "faBolt",
              title: "Real-time Editing",
              description:
                "Seamless collaboration with multiple users in real-time",
            },
            {
              icon: "faCodeBranch",
              title: "Version Control",
              description:
                "Track changes and maintain complete document history",
            },
            {
              icon: "faShieldAlt",
              title: "Enterprise Security",
              description:
                "End-to-end encryption and advanced security features",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                {/* <i className={`fas ${feature.icon} text-white text-xl`}></i> */}
                <FontAwesomeIcon icon={feature.icon} className="text-white text-xl" />
                <FontAwesomeIcon icon={faBrain} className="text-white text-xl" />
                
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
