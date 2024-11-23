
import React from "react";

import { Metadata } from "next";

import Login from "@/components/Auth/Login";
export const metadata: Metadata = {
  title:
    "Fizzvisa",
  description: "We provide a simple, fast, and easy online travel Visa conclerge",
};

const SignIn: React.FC = () => {
  return <Login />;
};

export default SignIn;
