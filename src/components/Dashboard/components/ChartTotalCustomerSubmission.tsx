"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { Card, Typography, Input, Button } from "@material-tailwind/react";
import Cookies from "js-cookie";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ChartTotalCustomerSubmission: React.FC = () => {
  const token = Cookies.get("token");

  const [total, setTotal] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [minEndDate, setMinEndDate] = useState<string>("");
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
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DEV_API}/dashboard/total-customer-submission?${startDate != "" ? `start_date=${startDate}` : ""}${endDate != "" ? `&end_date=${endDate}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setTotal(response.data.data.total || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
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
        Total Customers Assigned
      </Typography>
      <ReactApexChart
        options={{
          chart: {
            type: "radialBar",
          },
          plotOptions: {
            radialBar: {
              dataLabels: {
                value: {
                  show: true,
                  fontSize: "20px",
                  color: "#333",
                  offsetY: 4,
                  formatter: (value: any) => value, // Display the raw value without percentage
                },
              },
            },
          },
          colors: ["#3C50E0"],
          labels: ["Total Submitted"],
        }}
        series={[total]} // Displaying the total value directly
        type="radialBar"
        height={350}
      />
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

export default ChartTotalCustomerSubmission;
