import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title:
    "Fizzvisa",
  description: "We provide a simple, fast, and easy online travel Visa conclerge",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <ECommerce />
      </DefaultLayout>
    </>
  );
}
