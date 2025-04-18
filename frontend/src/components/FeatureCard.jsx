import React from "react";

const FeatureCard = ({ feature, isActive, onClick }) => {
  return (
    <div
      className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
        isActive
          ? "bg-blue-600 text-white transform scale-105"
          : "bg-white hover:bg-gray-50 shadow-md"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center mb-3">
        <i
          className={`fas ${feature.icon} ${isActive ? "text-white" : "text-blue-600"} text-xl`}
        ></i>
        <h3 className="text-xl font-semibold ml-3">{feature.title}</h3>
      </div>
      <p className={isActive ? "text-gray-100" : "text-gray-600"}>
        {feature.description}
      </p>
    </div>
  );
};

export default FeatureCard;
