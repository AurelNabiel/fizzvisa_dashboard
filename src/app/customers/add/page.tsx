import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Customers from "@/components/Customers/Customers";
import CustomerAdd from "@/components/Customers/AddCustomers/CustomerAdd";



export const metadata: Metadata = {
  title: "Fizzvisa",
  description: "We provide a simple, fast, and easy online travel Visa conclerge",
};

const CustomersAddPage: React.FC = () => {
  return (
    <DefaultLayout>
      <CustomerAdd/>
    </DefaultLayout>
  );
};

export default CustomersAddPage;