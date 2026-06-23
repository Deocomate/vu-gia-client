"use client";
import React from "react";

export default function NewsTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="w-full bg-white pt-[50px]">
      <div className="max-w-[1470px] mx-auto px-[20px] lg:px-[60px]">
        <div className="flex items-center justify-start lg:justify-center gap-[15px] overflow-x-auto no-scrollbar pb-[10px]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex-shrink-0 flex flex-col items-center justify-between cursor-pointer group px-[10px]"
              >
                <span
                  className={`font-montserrat text-[16px] lg:text-[18px] font-bold tracking-wide transition-colors duration-300 ${
                    isActive ? "text-[#97400C]" : "text-[#A0A0A0] group-hover:text-[#97400C]"
                  }`}
                >
                  {tab.name}
                </span>
                
                {/* Visual Active Indicator Line */}
                <div
                  className={`w-full h-[2px] mt-2 transition-all duration-300 ${
                    isActive ? "bg-[#97400C]" : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
