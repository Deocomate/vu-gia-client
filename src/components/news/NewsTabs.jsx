"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function NewsTabs({ tabs, activeTab, onTabChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const activeTabObj = tabs.find((t) => t.id === activeTab);
  const activeLabel = activeTabObj ? activeTabObj.name : "Kiến thức phong thuỷ";

  return (
    <div className="w-full bg-white pt-[30px] lg:pt-[50px] select-none">
      {/* Mobile Dropdown View */}
      <div className="lg:hidden w-full px-[20px] flex justify-center" ref={dropdownRef}>
        <div className="relative w-[266px] h-[48px]">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full h-full flex items-center justify-between px-[20px] border border-[#E1DEDE] rounded-[8px] bg-white font-montserrat font-[500] text-[16px] text-[#2E2F2A] hover:border-primary transition-all duration-300 cursor-pointer"
          >
            <span>{activeLabel}</span>
            <ChevronDown
              className={`w-5 h-5 text-[#777777] transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && (
            <div className="absolute top-[52px] left-0 w-full bg-white border border-[#E1DEDE] rounded-[8px] shadow-xl z-50 overflow-hidden py-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    onTabChange(tab.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3 font-montserrat text-[15px] transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#F4F5F6] text-[#97400C] font-[600]"
                      : "text-[#2E2F2A] hover:bg-[#F4F5F6] hover:text-[#97400C]"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Tabs View */}
      <div className="hidden lg:block max-w-[1280px] mx-auto px-0 border-b border-[#EAECF0]">
        <div className="flex items-center justify-center gap-[35px]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex-shrink-0 w-[240px] flex flex-col items-center justify-between cursor-pointer group pb-0"
              >
                <div className="pb-[16px] px-[4px] flex items-center justify-center gap-[8px]">
                  <span
                    className={`font-montserrat text-[18px] transition-colors duration-300 ${
                      isActive
                        ? "text-[#97400C] font-[700]"
                        : "text-[#A0A0A0] font-[600] group-hover:text-[#97400C]"
                    }`}
                  >
                    {tab.name}
                  </span>
                </div>
                
                {/* Visual Active Indicator Line */}
                <div
                  className={`w-full h-[2px] mt-0 transition-all duration-300 ${
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
