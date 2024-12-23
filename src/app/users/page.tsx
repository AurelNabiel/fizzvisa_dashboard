import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Users from "@/components/Users/Users";


export const metadata: Metadata = {
  title: "Fizzvisa",
  description: "We provide a simple, fast, and easy online travel Visa conclerge",
};

const UsersPage: React.FC = () => {
  return (
    <DefaultLayout>
      <Users/>
    </DefaultLayout>
  );
};

export default UsersPage;