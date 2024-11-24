import React from "react";
import { Metadata } from "next";
import Agents from "@/components/Agents/Agents";
export const metadata: Metadata = {
  title: "Fizzvisa",
  description:
    "We provide a simple, fast, and easy online travel Visa conclerge",
};

const AgentsPage: React.FC = () => {
  return <Agents />;
};

export default AgentsPage;