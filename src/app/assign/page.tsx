import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Assign from "@/components/Assign/Assign";

export const metadata: Metadata = {
  title: "Fizzvisa",
  description:
    "We provide a simple, fast, and easy online travel Visa conclerge",
};

const AssignPage: React.FC = () => {
  return (
    <DefaultLayout>
      <Assign />
    </DefaultLayout>
  );
};

export default AssignPage;
