"use client";
import dynamic from "next/dynamic";
import React from "react";
import ChartOne from "../Charts/ChartOne";
import ChartTwo from "../Charts/ChartTwo";
import ChartTotalSentLink from "./components/ChartTotalSentLink";
import ChartMostAssignedAgent from "./components/ChartMostAssignedAgent";
import ChartTotalCustomerSubmission from "./components/ChartTotalCustomerSubmission";

const MapOne = dynamic(() => import("@/components/Maps/MapOne"), {
  ssr: false,
});

const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
  ssr: false,
});

const Dashboard: React.FC = () => {
  return (
    <>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6">
        <div className="col-span-12 xl:col-span-6">
          <ChartTotalSentLink />
        </div>
        <div className="col-span-12 md:col-span-6">
          <ChartTotalCustomerSubmission />
        </div>
        <div className="col-span-12">
          <ChartMostAssignedAgent />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
