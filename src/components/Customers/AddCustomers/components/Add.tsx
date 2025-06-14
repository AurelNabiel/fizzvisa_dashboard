"use client";
import ModalPop from "@/components/ModalPop/ModalPop";
import { Button, Dialog } from "@headlessui/react";
import { Input, Option, Select, Typography } from "@material-tailwind/react";
import React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Cookies from "js-cookie";
// @ts-expect-error
import { useCountries } from "use-react-countries";

import { useForm, SubmitHandler, useWatch, Controller } from "react-hook-form";
import axios from "axios";

interface IFormInput {
  email: string;
  fullname: string;
  ref_code?: string;
  phone: string;
  depart_date: string;
  return_date: string;
  destination: string;
  ref_code_created_date?: string;
}
interface ImportStatus {
  load: boolean;
  error: boolean;
  message: string;
}

interface AddProps {
  // getCustomers: (key: string) => Promise<void>;
  onAddCustomer: (customer: any) => void;
  setStatus: (status: ImportStatus) => void;
  status: ImportStatus;
}
const schema = yup.object({
  fullname: yup.string().required("Name is required"),
  email: yup.string().email().required("Email is required"),
  phone: yup
    .string()
    .required("Phone is required")
    .test("len", "Phone number must be 8 digits", (val) => {
      if (val) {
        return val.length >= 8;
      }
      return false;
    }),
  ref_code: yup.string(),
  depart_date: yup
    .string()
    .required("Depart Date is required")
    .test(
      "minDepart",
      "Depart Date must be at least 1 months from today",
      (value) => {
        const today = new Date();
        const departDate = new Date(value);
        const minDepartDate = new Date(today.setMonth(today.getMonth() + 1));
        return departDate >= minDepartDate;
      },
    ),
  return_date: yup
    .string()
    .required("Return Date is required")
    .test(
      "minReturn",
      "Return Date must be after Depart Date",
      function (value) {
        const departDate = new Date(this.parent.depart_date);
        const returnDate = new Date(value);
        return returnDate >= departDate;
      },
    ),
  destination: yup.string().required("Country is required"),
  ref_code_created_date: yup.string().when("ref_code", {
    is: (ref_code: string) =>
      typeof ref_code === "string" && ref_code.trim() !== "",
    then: (schema) =>
      schema
        .required("Ref Code Created Date is required")
        .test(
          "ref_code",
          "Ref Code Created Date must match the provided Referral Code",
          function (value) {
            return value && this.parent.ref_code;
          },
        ),
    otherwise: (schema) => schema.notRequired(),
  }),
});
const Add: React.FC<AddProps> = ({ onAddCustomer, setStatus, status }) => {
  const { countries } = useCountries();
  const sortedCountries = countries
    ? countries
        .filter((country: { name: string }) => country.name)
        .sort((a: { name: string }, b: { name: string }) =>
          a.name.localeCompare(b.name),
        )
    : [];
  const token = Cookies.get("token");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });
  const currentName = useWatch({ control, name: "fullname" }) || "";
  //   console.log(currentName);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setStatus({ load: true, error: false, message: "" });
    try {
      const submitData = {
        ...data,
        first_name: data.fullname.split(" ")[0],
      };
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_DEV_API}/customer/create`,
          { customers: [submitData] },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => {
          console.log(res.data);
          setStatus({
            load: false,
            error: false,
            message: "Customers saved successfully.",
          });
          setTimeout(() => {
            setStatus({ load: false, error: false, message: "" });
          }, 3000);
        });

      setIsOpen(false);

      reset();
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      setStatus({ load: false, error: true, message: "" });
    }
  };
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  //   depart and return date
  const [departMinDate, setDepartMinDate] = React.useState("");
  const [returnMinDate, setReturnMinDate] = React.useState("");
  const departDate = watch("depart_date");
  const ref_code = watch("ref_code");

  React.useEffect(() => {
    const today = new Date();
    const oneMonthLater = new Date(today.setMonth(today.getMonth() + 1));
    oneMonthLater.setDate(oneMonthLater.getDate() + 1);
    setDepartMinDate(oneMonthLater.toISOString().split("T")[0]);
  }, []);

  React.useEffect(() => {
    if (departDate) {
      setReturnMinDate(departDate);
    }
  }, [departDate]);
  return (
    <>
      <div className="">
        <Button
          onClick={() => {
            setIsOpen(true);
          }}
          className="w-full cursor-pointer rounded-lg border border-primary bg-primary px-4 py-2 text-white transition hover:bg-opacity-90"
        >
          Add Manual
        </Button>
      </div>
      <ModalPop
        isOpen={isOpen}
        closeModalAdd={() => {
          setIsOpen(false);
          reset();
        }}
      >
        <Dialog.Title
          as="h3"
          className="mb-4 text-xl font-semibold text-gray-900 dark:text-white"
        >
          Add Customers
        </Dialog.Title>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Input Field */}
          <div>
            <label
              htmlFor="fullname"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Customers Name
            </label>
            <Input
              crossOrigin={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              {...register("fullname", { required: true })}
              type="text"
              className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-3 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {errors.fullname && (
              <Typography
                className="mt-5 flex items-center gap-2 text-sm text-red-500"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                {errors.fullname.message}
              </Typography>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Customers Email
            </label>
            <Input
              crossOrigin={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              {...register("email", { required: true })}
              placeholder="youremail@example.com"
              type="email"
              className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-3 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {errors.email && (
              <Typography
                className="mt-5 flex items-center gap-2 text-sm text-red-500"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                {errors.email.message}
              </Typography>
            )}
          </div>
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Customers Phone Number
            </label>
            <Input
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              crossOrigin={undefined}
              placeholder="081234567890"
              inputMode="numeric"
              pattern="[0-9]*"
              onBeforeInput={(e: React.FormEvent<HTMLInputElement>) => {
              const input = (e as any).data;
              if (input && /\D/.test(input)) {
                e.preventDefault();
              }
              }}
              {...register("phone", { required: true })}
              className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-3 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {errors.phone && (
              <Typography
                className="mt-5 flex items-center gap-2 text-sm text-red-500"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                {errors.phone.message}
              </Typography>
            )}
          </div>
          <div>
            <label
              htmlFor="ref_code"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Customers Referral Code
            </label>
            <Input
              crossOrigin={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              placeholder="Empty if none"
              {...register("ref_code", { required: true })}
              className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-3 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {errors.ref_code && (
              <Typography
                className="mt-5 flex items-center gap-2 text-sm text-red-500"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                {errors.ref_code.message}
              </Typography>
            )}
          </div>
          <div className="flex w-full flex-col gap-x-3 lg:flex-row">
            <div className="w-full">
              <label
                htmlFor="ref_code"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Customers Depart Date
              </label>
              <Input
                crossOrigin={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                {...register("depart_date", { required: true })}
                type="date"
                min={departMinDate}
                className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-3  text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {errors.depart_date && (
                <Typography
                  className="mt-5 flex items-center gap-2 text-sm text-red-500"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  {errors.depart_date.message}
                </Typography>
              )}
            </div>
            <div className="w-full">
              <label
                htmlFor="depart_date"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Customers Return Date
              </label>
              <Input
                crossOrigin={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                {...register("return_date", { required: true })}
                type="date"
                disabled={!departDate}
                min={returnMinDate}
                className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-3  text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {errors.return_date && (
                <Typography
                  className="mt-5 flex items-center gap-2 text-sm text-red-500"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  {errors.return_date.message}
                </Typography>
              )}
            </div>
          </div>
          <div className="relative w-full">
            <label
              htmlFor="destination"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Customers Destination Country
            </label>
            <div className="relative">
              <select
                defaultValue={""}
                id="destination"
                className="peer w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                {...register("destination", { required: true })}
              >
                <option value="" disabled>
                  Select Destination *
                </option>
                {sortedCountries?.map((country: { name: string }) => (
                  <option key={country.name} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 peer-focus:text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div>
            <label
              htmlFor="ref_code"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Customers Referral Date
            </label>
            <Input
              crossOrigin={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              disabled={!ref_code}
              {...register("ref_code_created_date", { required: true })}
              type="date"
              className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-3  text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {errors.ref_code_created_date && (
              <Typography
                className="mt-5 flex items-center gap-2 text-sm text-red-500"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                {errors.ref_code_created_date.message}
              </Typography>
            )}
          </div>
          {status.error && (
            <Typography
              className="mt-5 flex items-center gap-2 text-sm text-red-500"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fill-rule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Something went wrong, please try again later
            </Typography>
          )}
          {/* Buttons Section */}
          <div className="flex justify-end space-x-3">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                reset();
              }}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>

            {/* Add Button */}
            <button
              disabled={status.load || !currentName.trim()}
              type="submit"
              className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                status.load || !currentName.trim()
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600`}
            >
              {status.load ? "Loading..." : "Add"}
            </button>
          </div>
        </form>
      </ModalPop>
    </>
  );
};

export default Add;
