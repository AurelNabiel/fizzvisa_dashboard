"use client";
import React from "react";
import { OverviewData } from "./models/model";
import { Box, Diagram, Money, Profile2User } from "iconsax-react";

interface EcommerceMetricsProps {
  overview?: OverviewData;
}

const EcommerceMetrics: React.FC<EcommerceMetricsProps> = ({ overview }) => {
  const items = [
    {
      title: "Total Customers",
      value: overview ? overview?.total_customer : 0,
      icon: <Profile2User variant="Bold" size={28} color="#8280FF" />,
    },
    {
      title: "Total Submitted Customers",
      value: overview ? overview?.total_submitted_customer : 0,
      icon: <Box variant="Bold" size={28} color="#FEC53D" />,
    },
    {
      title: "Total Customers Paid",
      value: overview ? overview?.total_paid_customer : 0,
      icon: <Money variant="Bold" size={28} color="#4AD991" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      {items.map((item, index) => (
        <MetricItem key={index} data={item} />
      ))}
      {/* <!-- Metric Item End --> */}
    </div>
  );
};

interface MetricItemProps {
  data: {
    title: string;
    value: number;
    icon: React.JSX.Element;
  };
}

const MetricItem: React.FC<MetricItemProps> = ({ data }) => {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${data.title == "Total Customers" ? "bg-[#8280FF]/30" : data.title == "Total Submitted Customers" ? "bg-[#FEC53D]/30" : "bg-[#4AD991]/30"} `}
      >
        {data.icon}
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {data.title}
          </span>
          <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
            {data.value}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default EcommerceMetrics;
