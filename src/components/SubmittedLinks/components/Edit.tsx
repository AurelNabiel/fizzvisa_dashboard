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
}

interface EditProps {
  getData: (key: string) => Promise<void>;
  id: string;

  email: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}
const schema = yup
  .object({
    email: yup.string().email("Email is invalid").required("Email is required"),
  })
  .required();
const EditSubmitted: React.FC<EditProps> = ({
  getData,
  id,
  
  isOpen,
  setIsOpen,
  email,
}) => {
  const token = Cookies.get("token");
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const [status, setStatus] = React.useState({ load: false, error: false });
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setStatus({ load: true, error: false });
    try {
      const submitData = {
        email: data.email,
        send_status: "failed"
      }
      await axios
        .put(`${process.env.NEXT_PUBLIC_DEV_API}/customer/edit/${id}`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setStatus({ load: false, error: false });
          setIsOpen(false);
          getData("");
          reset();
        });
    } catch (error) {
      console.log(error);
      setStatus({ load: false, error: true });
      setTimeout(() => {
        setStatus({ load: false, error: false });
      }, 3000);
    }
  };

  return (
    <>
      <ModalPop
        isOpen={isOpen}
        closeModalAdd={() => {
          reset();
          setIsOpen(false);
        }}
      >
        <Dialog.Title
          as="h3"
          className="mb-4 text-xl font-semibold text-gray-900 dark:text-white"
        >
          Edit Customer
        </Dialog.Title>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Input Field */}
          
          <div>
            <label
              htmlFor="agentEmail"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Customer Email
            </label>
            <Input
              crossOrigin={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              {...register("email", { required: true, value: email })}
              placeholder="yourmail@example.com"
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
          {/* Error Message */}
          {status.error && (
            <p className="text-base font-semibold text-red-500">
              Something&apos;s wrong, please try again.
            </p>
          )}
          {/* Buttons Section */}
          <div className="flex justify-end space-x-3">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => {
                reset();
                setIsOpen(false);
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
              }`}
            >
              {status.load ? "Loading..." : "Edit"}
            </button>
          </div>
        </form>
      </ModalPop>
    </>
  );
};

export default EditSubmitted;
