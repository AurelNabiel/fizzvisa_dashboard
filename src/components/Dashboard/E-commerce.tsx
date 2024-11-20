"use client";
import dynamic from "next/dynamic";
import React from "react";
import ChartOne from "../Charts/ChartOne";
import ChartTwo from "../Charts/ChartTwo";


const MapOne = dynamic(() => import("@/components/Maps/MapOne"), {
  ssr: false,
});

const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
  ssr: false,
});

const ECommerce: React.FC = () => {
  return (
    <>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
      <ChartThree />
        <ChartThree />
        <ChartThree />
        <ChartThree />
        <MapOne />
        
      </div>
    </>
  );
};

export default ECommerce;
