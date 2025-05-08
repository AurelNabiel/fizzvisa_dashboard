import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CustomersLink from "@/components/Customers-link/Customers-link";


export const metadata: Metadata = {
  title: "FazzVisa",
  description: "We provide a simple, fast, and easy online travel Visa conclerge",
};

const CustomersPage: React.FC = () => {
  return (
    <DefaultLayout>
      <CustomersLink/>
    </DefaultLayout>
  );
};

export default CustomersPage;