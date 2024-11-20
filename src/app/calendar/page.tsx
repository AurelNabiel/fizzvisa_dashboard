import Calendar from "@/components/Calender";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title:
    "Fizzvisa",
  description: "We provide a simple, fast, and easy online travel Visa conclerge",
};

const CalendarPage = () => {
  return (
    <DefaultLayout>
      <Calendar />
    </DefaultLayout>
  );
};

export default CalendarPage;
