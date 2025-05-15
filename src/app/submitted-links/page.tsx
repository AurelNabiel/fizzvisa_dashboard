import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SubmittedLinks from "@/components/SubmittedLinks/Submitted";



export const metadata: Metadata = {
  title: "FazzVisa",
  description: "We provide a simple, fast, and easy online travel Visa conclerge",
};

const SubmittedLinksPage: React.FC = () => {
  return (
    <DefaultLayout>
      <SubmittedLinks/>
    </DefaultLayout>
  );
};

export default SubmittedLinksPage;