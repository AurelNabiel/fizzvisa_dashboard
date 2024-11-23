import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Customers from "@/components/Customers/Customers";


export const metadata: Metadata = {
  title: "Fizzvisa",
  description: "We provide a simple, fast, and easy online travel Visa conclerge",
};

const CustomersPage: React.FC = () => {
  return (
    <DefaultLayout>
      <Customers/>
    </DefaultLayout>
  );
};

export default CustomersPage;