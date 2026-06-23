import React from "react";
import ShowroomBanner from "@/components/showroom/ShowroomBanner";
import ShowroomIntro from "@/components/showroom/ShowroomIntro";
import ShowroomGallery from "@/components/showroom/ShowroomGallery";
import ShowroomMap from "@/components/showroom/ShowroomMap";

export default function ShowroomView() {
  return (
    <div className="w-full bg-white overflow-hidden">
      {/* Top Header Banner */}
      <ShowroomBanner />

      {/* Intro info block & right-bleeding slider */}
      <ShowroomIntro />

      {/* Full-width right-overflowing interior showcase carousel */}
      <ShowroomGallery />

      {/* High-end map section */}
      <ShowroomMap />
    </div>
  );
}
