"use client";
import dynamic from "next/dynamic";
import React from "react";
import ChartTotalSentLink from "./components/ChartTotalSentLink";
// import ChartMostAssignedAgent from "./components/ChartMostAssignedAgent";
import ChartTotalCustomerSubmission from "./components/ChartTotalCustomerSubmission";
import { OverviewData } from "./components/models/model";
import axios from "axios";
import EcommerceMetrics from "./components/EcommerceMetrics";
import Cookies from "js-cookie";

const MapOne = dynamic(() => import("@/components/Maps/MapOne"), {
  ssr: false,
});

const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
  ssr: false,
});

const Dashboard: React.FC = () => {
  const token = Cookies.get("token");

  const [overview, setOverview] = React.useState<OverviewData>();
  const [overviewStatus, setOverviewStatus] = React.useState({
    load: false,
    error: false,
  });
  const getOverview = async () => {
    try {
      setOverviewStatus({ load: true, error: false });
      await axios
        .get(`${process.env.NEXT_PUBLIC_DEV_API}/dashboard/overview-customer`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setOverview(res.data.data);
            setOverviewStatus({ load: false, error: false });
          } else {
            setOverviewStatus({ load: false, error: true });
          }
        });
    } catch (error) {
      console.log("Error fetching overview data:", error);
      setOverviewStatus({ load: false, error: true });
    }
  };

  React.useEffect(() => {
    getOverview();
  }, []);
  return (
    <>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6">
        <div className="col-span-12 space-y-6">
          {overviewStatus.load ? (
            loadMetrics()
          ) : (
            <EcommerceMetrics overview={overview} />
          )}

          {/* <MonthlySalesChart /> */}
        </div>
        <div className="col-span-12 xl:col-span-6">
          <ChartTotalSentLink />
        </div>
        {/* <div className="col-span-12 md:col-span-6">
          <ChartTotalCustomerSubmission />
        </div> */}
        {/* <div className="col-span-12">
          <ChartMostAssignedAgent />
        </div> */}
      </div>
    </>
  );
};

function loadMetrics() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
      {Array(4)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className="w-full animate-pulse rounded-2xl border border-gray-200 bg-gray-100 p-5 md:p-6"
          >
            <div className="h-12 w-12 rounded-xl bg-gray-300"></div>
            <div className="mt-5">
              <div className="h-4 w-3/4 rounded bg-gray-300"></div>
              <div className="mt-2 h-6 w-1/2 rounded bg-gray-400"></div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Dashboard;
