"use client";
import ModalPop from "@/components/ModalPop/ModalPop";
import { Button, Dialog } from "@headlessui/react";
import { Input, Typography } from "@material-tailwind/react";
import React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Cookies from "js-cookie";

import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import axios from "axios";

interface IFormInput {
  email: string;
  fullname: string;
  ref_code?: string;
  phone: string;
  depart_date: string;
  return_date: string;
  ref_code_created_date?: string;
}

interface EditProps {
  // getCustomers: (key: string) => Promise<void>;
  onAddCustomer: (customer: any) => void;
  email: string;
  fullname: string;
  ref_code?: string;
  phone: string;
  depart_date: string;
  return_date: string;
  ref_code_created_date?: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onEditCustomer: (customer: any) => void;
}
const schema = yup.object({
  fullname: yup.string().required("Name is required"),
  email: yup.string().email().required("Email is required"),
  phone: yup
    .string()
    .required("Phone is required")
    .test("len", "Phone number must be 11 digits", (val) => {
      if (val) {
        return val.length >= 11;
      }
      return false;
    }),
  ref_code: yup.string(),
  depart_date: yup
    .string()
    .required("Depart Date is required")
    .test(
      "minDepart",
      "Depart Date must be at least 3 months from today",
      (value) => {
        const today = new Date();
        const departDate = new Date(value);
        const minDepartDate = new Date(today.setMonth(today.getMonth() + 3));
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
const Edit: React.FC<EditProps> = ({
  onAddCustomer,
  email,
  fullname,
  ref_code,
  phone,
  depart_date,
  return_date,
  ref_code_created_date,
  isOpen,
  setIsOpen,
  onEditCustomer,
}) => {
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

  const [status, setStatus] = React.useState({ load: false, error: false });
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setStatus({ load: true, error: false });
    try {
      onEditCustomer(data);
      reset();
      setStatus({ load: false, error: false });
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      setStatus({ load: false, error: true });
    }
  };

  //   depart and return date
  const [departMinDate, setDepartMinDate] = React.useState("");
  const [returnMinDate, setReturnMinDate] = React.useState("");
  const departDate = watch("depart_date");
  const ref_watch = watch("ref_code");
  console.log(return_date, "return date");

  React.useEffect(() => {
    const today = new Date();
    const threeMonthsLater = new Date(today.setMonth(today.getMonth() + 3));
    threeMonthsLater.setDate(threeMonthsLater.getDate() + 1);
    setDepartMinDate(threeMonthsLater.toISOString().split("T")[0]);
  }, []);

  React.useEffect(() => {
    if (departDate) {
      setReturnMinDate(departDate);
    }
  }, [departDate]);

  interface FormatDateToMMDDYYYY {
    (date: string | Date | undefined): string;
  }

  const formatDateToMMDDYYYY: FormatDateToMMDDYYYY = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  console.log(formatDateToMMDDYYYY(depart_date));
  return (
    <>
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
          Edit Customers
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
              {...register("fullname", { required: true, value: fullname })}
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
              {...register("email", { required: true, value: email })}
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
              onKeyPress={(e) => {
                const allowedCharacters = /^[0-9+]$/;
                if (!allowedCharacters.test(e.key)) {
                  e.preventDefault(); // Mencegah karakter yang tidak diizinkan
                }
              }}
              {...register("phone", { required: true, value: phone })}
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
              {...register("ref_code", { required: true, value: ref_code })}
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
                {...register("depart_date", {
                  required: true,
                  value: formatDateToMMDDYYYY(depart_date),
                })}
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
                {...register("return_date", {
                  required: true,
                  value: formatDateToMMDDYYYY(return_date),
                })}
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
              disabled={!ref_watch}
              {...register("ref_code_created_date", {
                required: true,
                value: formatDateToMMDDYYYY(ref_code_created_date),
              })}
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
              disabled={status.load}
              type="submit"
              className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                status.load
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-green-600 hover:bg-green-700"
              } focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600`}
            >
              {status.load ? "Loading..." : "Edit"}
            </button>
          </div>
        </form>
      </ModalPop>
    </>
  );
};

export default Edit;
