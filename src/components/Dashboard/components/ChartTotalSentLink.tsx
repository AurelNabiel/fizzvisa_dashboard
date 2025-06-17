"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { Card, Typography, Input, Button } from "@material-tailwind/react";
import Cookies from "js-cookie";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ChartTotalSentLink: React.FC = () => {
  const token = Cookies.get("token");

  const [totalSent, setTotalSent] = useState<number>(0);
  const [totalNotSent, setTotalNotSent] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [minEndDate, setMinEndDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  React.useEffect(() => {
    const today = new Date();
    const threeMonthsLater = new Date(today.setMonth(today.getMonth() + 3));
    threeMonthsLater.setDate(threeMonthsLater.getDate() + 1);
    setMinEndDate(threeMonthsLater.toISOString().split("T")[0]);
  }, []);
  React.useEffect(() => {
    if (startDate) {
      setMinEndDate(startDate);
    }
  }, [startDate]);
  const getData = async (startDate: string, endDate: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DEV_API}/dashboard/link-status?${startDate != "" ? `start_date=${startDate}` : ""}${endDate != "" ? `&end_date=${endDate}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setTotalSent(response.data.data.total_sent_link.total);
      console.log("Total Sent Links Data:", response.data.data);
      setTotalNotSent(response.data.data.total_not_sent_link.total);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(startDate, endDate);
  }, [startDate, endDate]);

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
  };
  return (
    <Card
      className="rounded bg-white p-5 shadow dark:bg-boxdark"
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Typography
            variant="small"
            className="mb-2 font-medium"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Start Date
          </Typography>
          <Input
            type="date"
            placeholder="Select Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            crossOrigin={undefined}
          />
        </div>
        <div>
          <Typography
            variant="small"
            className="mb-2 font-medium"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            End Date
          </Typography>
          <Input
            type="date"
            placeholder="Select End Date"
            value={endDate}
            min={minEndDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            crossOrigin={undefined}
          />
        </div>
      </div>
      <Typography
        variant="h5"
        className="mb-4"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        Total Sent Links
      </Typography>
      {loading ? (
        <div className="flex h-80 flex-col items-center justify-center">
          {/* Skeleton Donut Chart */}
          <div className="relative h-40 w-40 animate-pulse rounded-full bg-gray-200">
            {/* Bagian tengah donat */}
            <div className="absolute inset-10 h-20 w-20 rounded-full bg-gray-100"></div>
          </div>
          {/* Skeleton untuk Legend */}
          <div className="mt-4 space-y-2">
            <div className="h-4 w-40 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>
      ) : (
        <ReactApexChart
          options={{
            chart: {
              type: "donut",
            },
            plotOptions: {
              pie: {
                donut: {
                  size: "60%", // Ukuran tengah donat
                  labels: {
                    show: true,
                    total: {
                      show: true,
                      label: "Total Links",
                      formatter: () => `${totalSent + totalNotSent}`, // Total jumlah
                    },
                  },
                },
              },
            },

            labels: ["Total Sent Links", "Total Not Sent Links"], // Label untuk setiap bagian
            colors: ["#3C50E0", "#FF4560"], // Warna: Biru (Sent), Merah (Not Sent)
            dataLabels: {
              style: {
                colors: ["#FFFFFF"],
              },
              enabled: false,
            },
            legend: {
              formatter: function (val, opts) {
                // Format legend untuk menampilkan label + jumlah
                const value = opts.w.globals.series[opts.seriesIndex];
                return `${val} : ${value}`;
              },
              position: "right", // Posisi legend di kanan
              labels: {
                colors: "#333", // Warna teks legend
                useSeriesColors: false, // Tidak mengikuti warna seri
              },
            },

            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200,
                  },
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
          }}
          series={[
            totalSent, // Total Sent Links
            totalNotSent, // Total Not Sent Links
          ]}
          type="donut"
          height={350}
        />
      )}

      <div className="mb-4 flex justify-end">
        <Button
          onClick={handleClear}
          className={`text-xs font-medium text-white ${startDate === "" && endDate === "" ? "bg-gray-300" : "bg-red-500 hover:bg-red-600"}`}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          disabled={startDate === "" && endDate === ""}
        >
          Clear Dates
        </Button>
      </div>
    </Card>
  );
};

export default ChartTotalSentLink;
