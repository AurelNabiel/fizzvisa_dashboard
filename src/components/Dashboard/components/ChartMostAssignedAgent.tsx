"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { Card, Typography, Input, Button } from "@material-tailwind/react";
import Cookies from "js-cookie";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface AgentData {
  agent_name: string;
  total: number;
}

const ChartMostAssignedAgent: React.FC = () => {
  const token = Cookies.get("token");

  const [data, setData] = useState<AgentData[]>([]);
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
        `${process.env.NEXT_PUBLIC_DEV_API}/dashboard/most-agent-assigned?${startDate != "" ? `start_date=${startDate}` : ""}${endDate != "" ? `&end_date=${endDate}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData(startDate, endDate);
  }, [startDate, endDate]);

  const agentNames = data.map((item) => item.agent_name);
  const agentTotals = data.map((item) => item.total);

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
  };
  return (
    <Card
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
      className="rounded bg-white p-5 shadow dark:bg-boxdark"
    >
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Typography
            variant="small"
            className="mb-2 font-medium"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Start Date
          </Typography>
          <Input
            type="date"
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
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            variant="small"
            className="mb-2 font-medium"
          >
            End Date
          </Typography>
          <Input
            type="date"
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
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        variant="h5"
        className="mb-4"
      >
        Most Assigned Agents
      </Typography>
      <ReactApexChart
        options={{
          chart: { type: "bar" },
          xaxis: { categories: agentNames },
          yaxis: { labels: { formatter: (val) => val.toString() } },
        }}
        series={[{ name: "Assignments", data: agentTotals }]}
        type="bar"
        height={300}
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

export default ChartMostAssignedAgent;
