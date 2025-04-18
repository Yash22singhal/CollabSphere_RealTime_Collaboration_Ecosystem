import React from "react";

const DemoPreview = ({ activeDemo }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">3 users editing</span>
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
              JD
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm">
              AR
            </div>
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">
              MK
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <img
          src="https://readdy.ai/api/search-image?query=modern%20document%20editor%20interface%20with%20collaborative%20editing%20features%20showing%20multiple%20cursors%20and%20AI%20suggestions%20clean%20minimal%20design&width=600&height=400&seq=6&orientation=landscape"
          alt="CollabSphere Editor Interface"
          className="w-full rounded-lg shadow-md"
        />
        <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
          <i className="fas fa-robot mr-2"></i>AI Suggestions Active
        </div>
      </div>
    </div>
  );
};

export default DemoPreview;
