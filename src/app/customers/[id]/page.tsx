import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CustomerDetail from "@/components/Customers/DetailCustomers/CustomerDetail";

export const metadata: Metadata = {
  title: "Fazzvisa",
  description:
    "We provide a simple, fast, and easy online travel Visa conclerge",
};

const CustomersDetailPage: React.FC = () => {
  return (
    <DefaultLayout>
      <CustomerDetail/>
    </DefaultLayout>
  );
};

export default CustomersDetailPage;
