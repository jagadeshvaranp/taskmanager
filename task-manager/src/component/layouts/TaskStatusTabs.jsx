import React from 'react';

function TaskStatusTabs({ tabs = [], activeTab, setActiveTab }) {
  return (
    <div className="my-2 overflow-x-auto no-scrollbar"> 
      <div className="flex border-b border-gray-200" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            role="tab"
            aria-selected={activeTab === tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`relative px-4 py-3 text-sm font-medium transition-colors duration-200 outline-none whitespace-nowrap ${
              activeTab === tab.label
                ? "text-blue-600" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{tab.label}</span>
              
              <span
                className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                  activeTab === tab.label
                    ? "bg-blue-100 text-blue-600" 
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {tab.count || 0}
              </span>
            </div>

            {/* Active Line Indicator */}
            {activeTab === tab.label && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 rounded-t-md transition-all" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TaskStatusTabs;