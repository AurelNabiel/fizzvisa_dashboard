import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Customers from "@/components/Customers/Customers";
import CustomersDetail from "@/components/Customers/Details/CustomersDetail";


export const metadata: Metadata = {
  title: "Fizzvisa",
  description: "We provide a simple, fast, and easy online travel Visa conclerge",
};

const CustomersDetailPage: React.FC = () => {
  return (
    <DefaultLayout>
      <CustomersDetail/>
    </DefaultLayout>
  );
};

export default CustomersDetailPage;