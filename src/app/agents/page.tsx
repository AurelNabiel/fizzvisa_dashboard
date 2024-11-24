import React from "react";
import { Metadata } from "next";
import Agents from "@/components/Agents/Agents";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
export const metadata: Metadata = {
  title: "Fizzvisa",
  description:
    "We provide a simple, fast, and easy online travel Visa conclerge",
};

const AgentsPage: React.FC = () => {
  return (
    <DefaultLayout>
       <Breadcrumb pageName="Agents List" />
      <Agents />;
    </DefaultLayout>
  );
};

export default AgentsPage;
